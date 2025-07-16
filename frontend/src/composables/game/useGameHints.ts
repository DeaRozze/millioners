import { useLocalStorage } from '@vueuse/core'
import { ref, Ref } from 'vue'
import type {Answer } from '@/types/game'

interface Hint {
  used: boolean
}

interface Hints {
  fiftyFifty: Hint
  audienceHelp: Hint
}

interface GameHintsReturn {
  hints: Ref<Hints>
  hiddenAnswers: Ref<number[]>
  audiencePercentages: Ref<Record<number, number>>
  useFiftyFifty: () => void
  useAudienceHelp: () => void
  resetHints: () => void
}

export function useGameHints(answers: Ref<Answer[]>): GameHintsReturn {
  const hints = useLocalStorage<Hints>('game-hints', {
    fiftyFifty: { used: false },
    audienceHelp: { used: false },
  })

  const hiddenAnswers = ref<number[]>([])
  const audiencePercentages = ref<Record<number, number>>({})

  const generateAudiencePercentages = (): Record<number, number> => {
    const correctAnswer = answers.value.find((answer) => answer.isCorrect)
    if (!correctAnswer) return {}

    const otherAnswers = answers.value.filter((answer) => !answer.isCorrect)

    const correctPercent = Math.floor(Math.random() * 30) + 50
    const percentages: Record<number, number> = { [correctAnswer.id]: correctPercent }

    let remaining = 100 - correctPercent
    otherAnswers.forEach((answer, index) => {
      const percent =
        index === otherAnswers.length - 1 ? remaining : Math.floor(Math.random() * remaining)
      percentages[answer.id] = percent
      remaining -= percent
    })

    return percentages
  }

  const useFiftyFifty = (): void => {
    const incorrectAnswers = answers.value
      .filter((answer) => !answer.isCorrect)
      .map((answer) => answer.id)

    const toRemove = incorrectAnswers.sort(() => Math.random() - 0.5).slice(0, 2)

    hints.value.fiftyFifty.used = true
    hiddenAnswers.value = toRemove
  }

  const useAudienceHelp = (): void => {
    const percentages = generateAudiencePercentages()
    hints.value.audienceHelp.used = true
    audiencePercentages.value = percentages
  }

  const resetHints = (): void => {
    hints.value = {
      fiftyFifty: { used: false },
      audienceHelp: { used: false },
    }
    hiddenAnswers.value = []
    audiencePercentages.value = {}
  }

  return {
    hints,
    hiddenAnswers,
    audiencePercentages,
    useFiftyFifty,
    useAudienceHelp,
    resetHints,
  }
}
