import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { PRIZE_STEPS } from '@/constants/game'
import { useLocalStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const selectedAnswerId = ref(null)
  const showResult = ref(false)
  const prize = useLocalStorage('gameState.prize', 0)
  const currentQuestionIndex = useLocalStorage('gameState.currentQuestionIndex', 0)

  const nextPrize = computed(() => {
    if (prize.value === 0) return PRIZE_STEPS[0]
    const currentPosition = PRIZE_STEPS.indexOf(prize.value)
    return currentPosition === PRIZE_STEPS.length - 1
      ? PRIZE_STEPS[currentPosition]
      : PRIZE_STEPS[currentPosition + 1]
  })

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

    nextPrize,

    resetGameState,
  }
})
