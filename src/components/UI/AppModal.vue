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
  background: var(--color-bg);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  position: relative;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--box-shadow);
}

.modal-close {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: var(--font-size-xl);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
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