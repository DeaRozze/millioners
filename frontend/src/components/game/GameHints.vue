<script setup lang="ts">
import { ref } from 'vue'

import type { Props } from '@/types/gameHints'
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'callFiftyFifty'): void
  (e: 'useAudienceHelp'): void
}>()

const fiftyFiftyTooltip = ref<boolean>(false)
const audienceHelpTooltip = ref<boolean>(false)
</script>

<template>
  <div class="game-hints">
    <div class="game-hints__hint-wrapper">
      <button
        class="game-hints__hint"
        :class="{ 'game-hints__hint--used': props.hints.fiftyFifty.used }"
        @click="emit('callFiftyFifty')"
        @mouseenter="props.hints.fiftyFifty.used ? (fiftyFiftyTooltip = true) : null"
        @mouseleave="fiftyFiftyTooltip = false"
        :disabled="props.hints.fiftyFifty.used || props.disabled"
      >
        50/50
      </button>
      <div
        v-if="props.hints.fiftyFifty.used && fiftyFiftyTooltip"
        class="game-hints__tooltip"
      >
        Вы уже использовали эту подсказку
      </div>
    </div>

    <div class="game-hints__hint-wrapper">
      <button
        class="game-hints__hint"
        :class="{ 'game-hints__hint--used': props.hints.audienceHelp.used }"
        @click="emit('useAudienceHelp')"
        @mouseenter="props.hints.audienceHelp.used ? (audienceHelpTooltip = true) : null"
        @mouseleave="audienceHelpTooltip = false"
        :disabled="props.hints.audienceHelp.used || props.disabled"
      >
        Помощь зала
      </button>
      <div
        v-if="props.hints.audienceHelp.used && audienceHelpTooltip"
        class="game-hints__tooltip"
      >
        Вы уже использовали эту подсказку
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-hints {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  &__hint-wrapper {
    position: relative;
    display: inline-block;
  }

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
  }

  &__tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg);
    color: var(--color-text);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    font-size: var(--font-size-sm);
    white-space: nowrap;
    box-shadow: var(--box-shadow);
    margin-bottom: var(--spacing-xs);
    z-index: 10;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: var(--color-bg) transparent transparent transparent;
    }
  }
}
</style>
