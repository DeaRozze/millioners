import { ref, onMounted } from 'vue'
import { useFetch } from '@vueuse/core'

export function useQuestions() {
  const questions = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  const shuffleAnswers = (answers) => [...answers].sort(() => Math.random() - 0.5)

  const decodeHtml = (text) => {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = text
    return textArea.textContent
  }

  const fetchQuestions = async (amount = 10) => {
    const { data, error: fetchError } = await useFetch(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
      {
        afterFetch(ctx) {
          ctx.data = ctx.data.results?.map((question, index) => ({
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
          })) || []
          return ctx
        }
      }
    ).json()

    if (fetchError.value) throw new Error(fetchError.value)
    return data.value
  }

  const loadQuestions = async () => {
    isLoading.value = true
    error.value = null
    try {
      questions.value = await fetchQuestions()
      if (questions.value.length === 0) {
        error.value = 'Вопросы не загружены. Попробуйте позже'
      }
    } catch{
      error.value = 'Ошибка загрузки'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadQuestions)

  return {
    questions,
    isLoading,
    error,
    loadQuestions,
  }
}
