import { ref, onMounted } from 'vue'
import { fetchQuestions } from '@/api/quizApi'

export function useQuestions() {
  const questions = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  const loadQuestions = async () => {
    try {
      const savedQuestions = localStorage.getItem('quizQuestions')
      if (savedQuestions) {
        questions.value = JSON.parse(savedQuestions)
        if (questions.value.length > 0) {
          isLoading.value = false
          return
        }
      }
      questions.value = await fetchQuestions()

      if (questions.value.length === 0) {
        error.value = 'Вопросы не загружены. Попробуйте позже'
        return
      }
      localStorage.setItem('quizQuestions', JSON.stringify(questions.value))
    } catch (err) {
      error.value = 'Ошибка загрузки вопросов:' + err.message
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
