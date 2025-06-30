<script setup>
import { ref } from 'vue'

const props = defineProps({
  answers: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['useFiftyFifty', 'useAudienceHelp'])

const hints = ref({
  fiftyFifty: { used: false },
  audienceHelp: { used: false }
})

const generateAudiencePercentages = () => {
  const correctAnswer = props.answers.find(answer => answer.isCorrect)
  const otherAnswers = props.answers.filter(answer => !answer.isCorrect)

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
  const incorrectAnswers = props.answers
    .filter(answer => !answer.isCorrect)
    .map(answer => answer.id)

  const toRemove = incorrectAnswers
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)

  hints.value.fiftyFifty.used = true
  emit('useFiftyFifty', toRemove)
}

const useAudienceHelp = () => {
  const percentages = generateAudiencePercentages()
  hints.value.audienceHelp.used = true
  emit('useAudienceHelp', percentages)
}
</script>

<template>
  <div class="game-hints">
    <button
      class="game-hints__hint"
      :class="{ 'game-hints__hint--used': hints.fiftyFifty.used }"
      @click="useFiftyFifty"
      :disabled="hints.fiftyFifty.used"
    >
      50/50
    </button>
    <button
      class="game-hints__hint"
      :class="{ 'game-hints__hint--used': hints.audienceHelp.used }"
      @click="useAudienceHelp"
      :disabled="hints.audienceHelp.used"
    >
      Помощь зала
    </button>
  </div>
</template>

<style lang="scss" scoped>
.game-hints {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  &__hint {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    background: var(--color-primary);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    &:hover:not(:disabled) {
      background: oklch(from var(--color-primary) calc(l + 0.1) c h);
      transform: translateY(-2px);
    }

    &:disabled {
      cursor: not-allowed;
    }

    &--used {
      opacity: 0.5;
      background: rgba(var(--color-primary), 0.3);
    }

    &--disabled {
      display: none;
    }
  }
}
</style>
