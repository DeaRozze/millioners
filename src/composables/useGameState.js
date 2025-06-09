import { ref} from 'vue'
import { PRIZE_STEPS } from '@/constants/game'

export function useGameState() {
  const selectedAnswerId = ref(null)
  const showResult = ref(false)
  const prize = ref(0)
  const currentQuestionIndex = ref(0)

  const getNextPrize = () => {
    if (prize.value === 0) return PRIZE_STEPS[0]
    const currentIndex = PRIZE_STEPS.indexOf(prize.value)
    return currentIndex < PRIZE_STEPS.length - 1
      ? PRIZE_STEPS[currentIndex + 1]
      : PRIZE_STEPS[PRIZE_STEPS.length - 1]
  }

  const resetGameState = () => {
    selectedAnswerId.value = null
    showResult.value = false
    prize.value = 0
    currentQuestionIndex.value = 0
  }

  return {
    selectedAnswerId,
    showResult,
    prize,
    currentQuestionIndex,
    getNextPrize,
    resetGameState,
  }
}
