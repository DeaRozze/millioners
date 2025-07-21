<script setup lang="ts">
import { defineModel } from 'vue'
import { onClickOutside, templateRef } from '@vueuse/core'

const modelValue = defineModel<boolean>()

const modalContentRef = templateRef<HTMLElement | null>('modalContentRef')

onClickOutside(modalContentRef, () => {
  modelValue.value = false
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="modal-overlay"
    >
      <div
        class="modal-content"
        ref="modalContentRef"
      >
        <button
          class="modal-close"
          @click="modelValue = false"
        >
          ×
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
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
  z-index: var(--z-index-modal);
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
