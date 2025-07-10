<script setup>
import AppModal from '@/components/UI/AppModal.vue'
import AppButton from '@/components/UI/AppButton.vue'

const modelValue = defineModel()
</script>

<template>
  <AppModal v-model="modelValue">
    <div class="auth-redirect-modal">
      <h2 class="auth-redirect-modal__title">Вход в аккаунт</h2>
      <p class="auth-redirect-modal__text">Для доступа к профилю необходимо авторизоваться</p>
      <AppButton @click="modelValue = false"> Закрыть </AppButton>
    </div>
  </AppModal>
</template>

<style lang="scss" scoped>
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
