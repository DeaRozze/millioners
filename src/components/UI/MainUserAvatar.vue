<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/auth/useAuth'
import ProfileModal from '@/components/auth/ProfileModal.vue'
import AuthRedirectModal from '@/components/auth/AuthRedirectModal.vue'

const { currentUser } = useAuth()
const isProfileModalOpen = ref(false)
const isAuthModalOpen = ref(false)

const avatarUrl = computed(() => currentUser.value?.avatar || '/default-avatar.png')
const username = computed(() => currentUser.value?.name || 'Гость')

const handleAvatarClick = () => {
  if (currentUser.value?.name) {
    isProfileModalOpen.value = true
  } else {
    isAuthModalOpen.value = true
  }
}
</script>

<template>
  <div class="user-avatar">
    <img
      :src="avatarUrl"
      :alt="username"
      class="user-avatar__image"
      @click.stop="handleAvatarClick"
    />
    <span class="user-avatar__name">{{ username }}</span>

    <ProfileModal
      v-model="isProfileModalOpen"
      :avatarUrl="avatarUrl"
      :username="username"
    />

    <AuthRedirectModal
      v-model="isAuthModalOpen"
      v-if="!currentUser?.name"
    />
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
