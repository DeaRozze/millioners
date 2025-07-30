import { ref, onMounted, Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Question } from '@/types/game'
import { omit } from 'es-toolkit'

interface UseQuestionsReturn {
  questions: Ref<Question[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  loadQuestions: () => Promise<void>
}

export function useQuestions(): UseQuestionsReturn {
  const questions = ref<Question[]>([])
  const isLoading = ref<boolean>(true)
  const error = ref<string | null>(null)

  const storedQuestions = useLocalStorage<Question[]>('game-questions', [])

  const loadQuestions = async (retryCount = 3): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('https://millioners.onrender.com/api/questions')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received from server')
      }

      const questionsWithoutAnswers = data.questions.map((q: Question) => omit(q, ['answers']))

      storedQuestions.value = questionsWithoutAnswers

      questions.value = data.questions
      error.value = null
    } catch (err) {
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return loadQuestions(retryCount - 1)
      }
      error.value = err instanceof Error ? err.message : 'Failed to load questions'
      console.error('Error loading questions:', err)
      questions.value = []
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    if (questions.value.length === 0) {
      loadQuestions()
    } else {
      isLoading.value = false
    }
  })

  return {
    questions,
    isLoading,
    error,
    loadQuestions,
  }
}
