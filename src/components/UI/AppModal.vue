<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const mouseDownTarget = ref(null)
const handleMouseDown = (event) => {
  mouseDownTarget.value = event.target
}

const handleClose = (event) => {
  if (mouseDownTarget.value === event.currentTarget) {
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="handleClose" @mousedown="handleMouseDown">
      <div class="modal-content">
        <button class="modal-close" @click="handleClose">×</button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<style lang='scss' scoped>
@use '@/assets/styles/variables' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: $color-bg;
  padding: $spacing-xl;
  border-radius: $border-radius;
  position: relative;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: $box-shadow;
}

.modal-close {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  font-size: $font-size-xl;
  background: none;
  border: none;
  cursor: pointer;
  color: $color-text;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>