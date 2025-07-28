import { PRIZE_STEPS } from '@/constants/game'
import { ref, type Ref } from 'vue'
import { useSoundStore } from '@/stores/soundStore'
import type { Question, Answer } from '@/types/game'
import type { useGameStore } from '@/stores/gameStore'

interface UseAnswerLogicProps {
  questions: Ref<Question[]>
  hiddenAnswers?: Ref<number[]>
  gameStore: ReturnType<typeof useGameStore>
}

export function useAnswerLogic({ questions, hiddenAnswers, gameStore }: UseAnswerLogicProps) {
  const isProcessing = ref(false)
  const showResultModal = ref(false)
  const soundStore = useSoundStore()

  const getAnswerClass = (answer: Answer): string => {
    if (hiddenAnswers?.value?.includes(answer.id)) return 'answer--hidden'
    if (isProcessing.value && gameStore.selectedAnswerId === answer.id) {
      return 'answer--selected answer--processing'
    }
    if (!gameStore.showResult) {
      return gameStore.selectedAnswerId === answer.id ? 'answer--selected' : ''
    }
    if (answer.isCorrect) return 'answer--correct'
    if (gameStore.selectedAnswerId === answer.id && !answer.isCorrect) return 'answer--incorrect'
    return ''
  }

  const selectAnswer = async (answerId: number): Promise<void> => {
    if (gameStore.showResult || isProcessing.value || hiddenAnswers?.value?.includes(answerId))
      return

    soundStore.pauseGameMusic()
    gameStore.selectedAnswerId = answerId
    isProcessing.value = true

    await new Promise((resolve) => setTimeout(resolve, 1000))

    isProcessing.value = false
    gameStore.showResult = true

    const currentQuestion = questions.value[gameStore.currentQuestionIndex]
    const selectedAnswer = currentQuestion.answers.find((a) => a.id === answerId)
    if (!selectedAnswer) return

    soundStore[selectedAnswer.isCorrect ? 'playCorrectSound' : 'playWrongSound']()

    if (selectedAnswer.isCorrect) {
      const currentLevel = PRIZE_STEPS.findIndex((step) => step > gameStore.prize)
      gameStore.prize =
        currentLevel >= 0 ? PRIZE_STEPS[currentLevel] : PRIZE_STEPS[PRIZE_STEPS.length - 1]
    } else {
      gameStore.prize = 0
      showResultModal.value = true
    }
  }

  const canGonextQuestion = (): boolean => {
    gameStore.currentQuestionIndex++
    return gameStore.currentQuestionIndex >= questions.value.length
  }

  return {
    getAnswerClass,
    selectAnswer,
    canGonextQuestion,
    isProcessing,
    showResultModal,
  }
}
