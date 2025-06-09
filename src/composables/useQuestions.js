import { ref, onMounted } from 'vue'
import { fetchQuestions } from '@/api/quizApi'

export function useQuestions() {
  const questions = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  const loadQuestions = async () => {
    try {
      if (questions.value.length === 0) {
        error.value = 'Вопросы не загружены. Попробуйте позже.'
      }
    } catch (err) {
      error.value = 'Ошибка загрузки вопросов: ' + err.message
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
