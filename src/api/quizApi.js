export const fetchQuestions = async (amount = 10) => {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`)
    if (!response.ok) return []
    const data = await response.json()
    if (!data.results || data.results.length === 0) return []
    return data.results.map((question, index) => ({
      id: index + 1,
      text: decodeHtml(question.question),
      answers: shuffleAnswers([
        { id: 1, text: decodeHtml(question.correct_answer), isCorrect: true },
        ...question.incorrect_answers.map((ans, i) => ({
          id: i + 2,
          text: decodeHtml(ans),
          isCorrect: false,
        })),
      ]),
    }))
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return []
  }
}
const shuffleAnswers = (answers) => {
  return [...answers].sort(() => Math.random() - 0.5)
}

const decodeHtml = (text) => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.textContent
}
