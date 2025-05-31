<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: true
  }
})

defineEmits(['click'])
</script>

<template>
  <button class="app-button" :class="{ 'app-button--primary': primary }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<style lang='scss' scoped>
@use '@/assets/styles/variables' as *;
@use 'sass:color';

.app-button {
  padding: $spacing-md $spacing-lg;
  border: none;
  border-radius: $border-radius;
  font-size: $font-size-md;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: $box-shadow;

  &--primary {
    background: $color-primary;
    color: $color-text;

    &:hover {
      background: color.adjust($color-primary, $lightness: 10%);
      transform: translateY(-2px);
    }
  }

  &:not(&--primary) {
    background: rgba($color-text, 0.1);
    color: $color-text;

    &:hover {
      background: rgba($color-text, 0.2);
    }
  }
}
</style>