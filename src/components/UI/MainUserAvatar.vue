<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AppModal from '@/components/UI/AppModal.vue'
import AppButton from '@/components/UI/AppButton.vue'

const { currentUser, logout } = useAuth()
const isProfileModalOpen = ref(false)
const isAuthModalOpen = ref(false)

const avatarUrl = computed(() => {
  return currentUser.value?.avatar || '/default-avatar.png'
})

const username = computed(() => {
  return currentUser.value?.name || 'Гость'
})

const handleAvatarClick = () => {
  if (currentUser.value?.name) {
    isProfileModalOpen.value = true
  } else {
    isAuthModalOpen.value = true
  }
}

const handleLogout = () => {
  logout()
  isProfileModalOpen.value = false
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

    <AppModal
      v-model="isProfileModalOpen"
      v-if="currentUser?.name"
    >
      <div class="profile-modal">
        <div class="profile-modal__avatar">
          <img
            :src="avatarUrl"
            :alt="username"
            class="profile-modal__image"
          />
        </div>
        <h2 class="profile-modal__name">{{ username }}</h2>
        <AppButton
          class="profile-modal__logout"
          @click="handleLogout"
        >
          Выйти
        </AppButton>
      </div>
    </AppModal>

    <AppModal
      v-model="isAuthModalOpen"
      v-if="!currentUser?.name"
    >
      <div class="auth-redirect-modal">
        <h2 class="auth-redirect-modal__title">Вход в аккаунт</h2>
        <p class="auth-redirect-modal__text">Для доступа к профилю необходимо авторизоваться</p>
        <AppButton
          @click="isAuthModalOpen = false"
          @click.stop
        >
          Закрыть
        </AppButton>
      </div>
    </AppModal>
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

.profile-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);

  &__avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--color-primary);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name {
    font-size: var(--font-size-xl);
    color: var(--color-accent);
    margin: 0;
  }

  &__logout {
    background: #f44336;
    margin-top: var(--spacing-lg);

    &:hover {
      background: #d32f2f;
    }
  }
}

.auth-redirect-modal {
  text-align: center;
  padding: var(--spacing-xl);

  &__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }

  &__text {
    margin-bottom: var(--spacing-lg);
  }
}
</style>
