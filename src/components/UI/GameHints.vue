<script setup>
defineProps({
  hints: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['useFiftyFifty', 'useAudienceHelp'])
</script>

<template>
  <div class="game-hints">
    <button
      class="game-hints__hint"
      :class="{ 'game-hints__hint--used': hints.fiftyFifty.used }"
      @click="emit('useFiftyFifty')"
      :disabled="hints.fiftyFifty.used"
    >
      50/50
    </button>
    <button
      class="game-hints__hint"
      :class="{ 'game-hints__hint--used': hints.audienceHelp.used }"
      @click="emit('useAudienceHelp')"
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
