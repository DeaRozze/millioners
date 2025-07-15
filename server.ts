import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()
app.use('*', logger())
app.use('/api/*', cors())

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

function shuffleAnswers(answers: any[]): any[] {
  return [...answers]
    .map((answer, index) => ({
      ...answer,
      id: index + 1,
    }))
    .sort(() => Math.random() - 0.5)
}

app.get('/api/questions', async (c) => {
  try {
    const amount = c.req.query('amount') || '10'
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(apiUrl, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error('OpenTDB API error:', await response.text())
      return c.json({ error: 'Failed to fetch questions from OpenTDB' }, 502)
    }

    const data = await response.json()

    if (data.response_code !== 0) {
      console.error('OpenTDB API response code:', data.response_code)
      return c.json({ error: 'OpenTDB API returned error' }, 502)
    }

    const questions =
      data.results?.map((question: any, index: number) => ({
        id: index + 1,
        text: decodeHtml(question.question),
        answers: shuffleAnswers([
          { text: decodeHtml(question.correct_answer), isCorrect: true },
          ...question.incorrect_answers.map((ans: string) => ({
            text: decodeHtml(ans),
            isCorrect: false,
          })),
        ]),
      })) || []

    return c.json({ questions })
  } catch (err) {
    console.error('Server error:', err)
    if (err instanceof Error && err.name === 'AbortError') {
      return c.json({ error: 'Request to OpenTDB timed out' }, 504)
    }
    return c.json({ error: 'Internal server error' }, 500)
  }
})

const port = 3000
serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Server is running on http://localhost:${port}`)
  },
)
