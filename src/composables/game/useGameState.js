import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { PRIZE_STEPS } from '@/constants/game'

export function useGameState() {
  const selectedAnswerId = ref(null)
  const showResult = ref(false)
  const prize = useLocalStorage('gameState.prize', 0)
  const currentQuestionIndex = useLocalStorage('gameState.currentQuestionIndex', 0)

  const getNextPrize = () => {
    if (prize.value === 0) return PRIZE_STEPS[0]
    const currentPosition = PRIZE_STEPS.indexOf(prize.value)
    if (currentPosition === PRIZE_STEPS.length - 1) {
      return PRIZE_STEPS[currentPosition]
    }
    return PRIZE_STEPS[currentPosition + 1]
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
