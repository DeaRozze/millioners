<script setup lang="ts">
interface Props {
  primary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  primary: true,
})

defineEmits(['click'])
</script>

<template>
  <button
    class="app-button"
    :class="{ 'app-button--primary': props.primary }"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--box-shadow);

  &--primary {
    background: var(--color-primary);
    color: var(--color-text);

    &:hover {
      background: oklch(from var(--color-primary) calc(l + 0.1) c h);
      transform: translateY(-2px);
    }
  }

  &:not(&--primary) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
