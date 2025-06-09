import { PRIZE_STEPS } from '@/constants/game'
import { useRouter } from 'vue-router'

export function useAnswerLogic(
  questions,
  currentQuestionIndex,
  selectedAnswerId,
  showResult,
  prize,
) {
  const router = useRouter()

  const getAnswerClass = (answer) => {
    if (!showResult.value) {
      return selectedAnswerId.value === answer.id ? 'answer--selected' : ''
    }
    if (answer.isCorrect) return 'answer--correct'
    if (selectedAnswerId.value === answer.id && !answer.isCorrect) return 'answer--incorrect'
    return ''
  }

  const selectAnswer = (answerId) => {
    if (showResult.value) return
    selectedAnswerId.value = answerId
    showResult.value = true

    const currentQuestion = questions.value[currentQuestionIndex.value]
    const selectedAnswer = currentQuestion.answers.find((a) => a.id === answerId)

    if (selectedAnswer.isCorrect) {
      const currentLevel = PRIZE_STEPS.findIndex((step) => step > prize.value)
      prize.value =
        currentLevel >= 0 ? PRIZE_STEPS[currentLevel] : PRIZE_STEPS[PRIZE_STEPS.length - 1]
    } else {
      prize.value = 0
      router.push('/result')
    }
  }
  const nextQuestion = () => {
    currentQuestionIndex.value++
    return currentQuestionIndex.value >= questions.value.length
  }
  return {
    getAnswerClass,
    selectAnswer,
    nextQuestion,
  }
}
