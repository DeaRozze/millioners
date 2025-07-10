import { ref, onMounted,Ref } from 'vue'
import { useFetch } from '@vueuse/core'

interface Question {
  id: number
  text: string
  answers: Answer[]
}

interface Answer {
  id: number
  text: string
  isCorrect: boolean
}

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

  const shuffleAnswers = (answers: Omit<Answer, 'id'>[]): Answer[] => {
    return [...answers].map((answer, index) => ({
      ...answer,
      id: index + 1,
    })).sort(() => Math.random() - 0.5)
  }

  const decodeHtml = (text: string): string => {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = text
    return textArea.textContent || ''
  }

  const fetchQuestions = async (amount = 10): Promise<Question[]> => {
    const { data, error: fetchError } = await useFetch(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
      {
        afterFetch(ctx) {
          ctx.data =
            ctx.data.results?.map((question: any, index: number) => ({
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
          return ctx
        },
      },
    ).json()

    if (fetchError.value) throw new Error(fetchError.value)
    return data.value
  }

  const loadQuestions = async (): Promise<void> => {
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
