export const fetchQuestions = async (amount = 10) => {
  const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`)
  const data = await response.json()
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
}

const shuffleAnswers = (answers) => {
  return [...answers].sort(() => Math.random() - 0.5)
}

const decodeHtml = (text) => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.textContent
}
