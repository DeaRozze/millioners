import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import questionsRouter from './routes/questions'

const app = new Hono()

app.use('*', logger())
app.use('/api/*', cors())

app.route('/api/questions', questionsRouter)

const port = parseInt(process.env.PORT || '3000')

serve({
  fetch: app.fetch,
  port
}, () => {
  console.log(`Server is running on port ${port}`)
})

export default app