import { useFetch } from '@vueuse/core'

export const useQuizApi = () => {
  const fetchQuestions = async (amount = 10) => {
    const { data, error } = await useFetch(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
    ).json()

    if (error.value) {
      console.error('Failed to fetch questions:', error.value)
      return []
    }

    if (!data.value?.results || data.value.results.length === 0) {
      return []
    }

    return data.value.results.map((question, index) => ({
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

  return { fetchQuestions }
}
const shuffleAnswers = (answers) => {
  return [...answers].sort(() => Math.random() - 0.5)
}

const decodeHtml = (text) => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.textContent
}
