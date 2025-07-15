<script setup lang="ts">
import { computed } from 'vue'
import { PRIZE_STEPS } from '@/constants/game'

const props = defineProps<{
  currentPrize: number
}>()

const pyramidSteps = computed(() => {
  return PRIZE_STEPS.map((prize, index) => ({
    prize,
    isCurrent: prize === props.currentPrize,
    isPassed: prize < props.currentPrize,
    level: index + 1,
  }))
})
</script>

<template>
  <div class="prize-pyramid">
    <transition-group name="pyramid-fade">
      <div
        v-for="{ prize, isPassed, isCurrent } in pyramidSteps"
        v-show="!isPassed"
        :key="prize"
        class="pyramid-step"
        :class="{
          'pyramid-step--current': isCurrent,
        }"
      >
        <span class="pyramid-step__prize">{{ prize }} ₽</span>
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.prize-pyramid {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  min-width: 180px;
}

.pyramid-step {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(var(--color-text), 0.6);
  transition: all 0.3s ease;

  &__prize {
    font-weight: bold;
  }

  &--current {
    background: var(--color-primary);
    color: var(--color-text);
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(var(--color-accent), 0.5);
  }
}

// Анимация для исчезновения пройденных ступеней
.pyramid-fade-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}

.pyramid-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
