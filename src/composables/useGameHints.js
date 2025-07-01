import { ref } from 'vue'

export function useGameHints(answers) {
  const hints = ref({
    fiftyFifty: { used: false },
    audienceHelp: { used: false }
  })

  const hiddenAnswers = ref([])
  const audiencePercentages = ref({})

  const generateAudiencePercentages = () => {
    const correctAnswer = answers.value.find(answer => answer.isCorrect)
    const otherAnswers = answers.value.filter(answer => !answer.isCorrect)

    const correctPercent = Math.floor(Math.random() * 30) + 50
    const percentages = { [correctAnswer.id]: correctPercent }

    let remaining = 100 - correctPercent
    otherAnswers.forEach((answer, index) => {
      const percent = index === otherAnswers.length - 1
        ? remaining
        : Math.floor(Math.random() * remaining)
      percentages[answer.id] = percent
      remaining -= percent
    })

    return percentages
  }

  const useFiftyFifty = () => {
    const incorrectAnswers = answers.value
      .filter(answer => !answer.isCorrect)
      .map(answer => answer.id)

    const toRemove = incorrectAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    hints.value.fiftyFifty.used = true
    hiddenAnswers.value = toRemove
  }

  const useAudienceHelp = () => {
    const percentages = generateAudiencePercentages()
    hints.value.audienceHelp.used = true
    audiencePercentages.value = percentages
  }

  return {
    hints,
    hiddenAnswers,
    audiencePercentages,
    useFiftyFifty,
    useAudienceHelp
  }
}
