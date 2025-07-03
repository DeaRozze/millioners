<script setup>
import AppModal from '@/components/UI/AppModal.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { useAuth } from '@/composables/auth/useAuth'

const { logout } = useAuth()

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleLogout = () => {
  logout()
  emit('update:modelValue', false)
}
</script>

<template>
  <AppModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <div class="profile-modal">
      <div class="profile-modal__avatar-wrapper">
        <img
          :src="avatarUrl"
          :alt="username"
          class="profile-modal__avatar-image"
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
</template>

<style lang="scss" scoped>
.profile-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  text-align: center;

  &__avatar-wrapper {
    width: 80px; // Уменьшил размер кружка
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--color-primary); // Более тонкая рамка
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(var(--color-primary), 0.1);
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name {
    font-size: var(--font-size-lg); // Сделал меньше размер имени
    color: var(--color-accent);
    margin: var(--spacing-sm) 0;
  }

  &__logout {
    background: #f44336;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-md);

    &:hover {
      background: #d32f2f;
    }
  }
}
</style>
