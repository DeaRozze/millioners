import { PRIZE_STEPS } from '@/constants/game'
import { ref } from 'vue'

export function useAnswerLogic(
  questions,
  currentQuestionIndex,
  selectedAnswerId,
  showResult,
  prize,
) {
  const isProcessing = ref(false)
  const showResultModal = ref(false)

  const getAnswerClass = (answer) => {
    if (isProcessing.value && selectedAnswerId.value === answer.id) {
      return 'answer--selected answer--processing'
    }
    if (!showResult.value) {
      return selectedAnswerId.value === answer.id ? 'answer--selected' : ''
    }
    if (answer.isCorrect) return 'answer--correct'
    if (selectedAnswerId.value === answer.id && !answer.isCorrect) return 'answer--incorrect'
    return ''
  }

  const selectAnswer = async (answerId) => {
    if (showResult.value || isProcessing.value) return
    selectedAnswerId.value = answerId
    isProcessing.value = true

    await new Promise((resolve) => setTimeout(resolve, 1000))

    isProcessing.value = false
    showResult.value = true
    const currentQuestion = questions.value[currentQuestionIndex.value]
    const selectedAnswer = currentQuestion.answers.find((a) => a.id === answerId)

    if (selectedAnswer.isCorrect) {
      const currentLevel = PRIZE_STEPS.findIndex((step) => step > prize.value)
      prize.value =
        currentLevel >= 0 ? PRIZE_STEPS[currentLevel] : PRIZE_STEPS[PRIZE_STEPS.length - 1]
    } else {
      prize.value = 0
      showResultModal.value = true
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
    isProcessing,
    showResultModal,
  }
}
