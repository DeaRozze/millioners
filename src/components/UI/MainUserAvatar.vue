<script setup>
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

const currentUser = useLocalStorage('current-user', null)
console.log('Тип currentUser:', typeof currentUser.value)
console.log('Значение currentUser:', currentUser.value)

const avatarUrl = computed(() => {
  return currentUser.value?.avatar || '/default-avatar.png'
})

const username = computed(() => {
  return currentUser.value?.name || 'Гость'
})
</script>

<template>
  <div class="user-avatar">
    <img
      :src="avatarUrl"
      :alt="username"
      class="user-avatar__image"
    />
    <span class="user-avatar__name">{{ username }}</span>
  </div>
</template>
<style lang="scss" scoped>
.user-avatar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;

  &__image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-primary);
  }

  &__name {
    font-size: var(--font-size-sm);
    color: var(--color-text);
  }
}
</style>
