<script setup>
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

const currentUser = useLocalStorage('current-user', null)

const avatarUrl = computed(() => {
  return currentUser.value?.avatar || '/default-avatar.png'
})
</script>

<template>
  <div class="user-avatar">
    <img
      :src="avatarUrl"
      :alt="username"
      class="user-avatar__image"
      @error="(e) => (e.target.src = '/default-avatar.png')"
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
    border-radius: 50%; /* Круглый аватар */
    object-fit: cover; /* Чтобы изображение заполняло область */
    border: 2px solid var(--color-primary); /* Рамка */
  }

  &__name {
    font-size: var(--font-size-sm);
    color: var(--color-text);
  }
}
</style>
