<script setup>
import AppModal from './AppModal.vue'
</script>

<template>
  <AppModal>
    <h2 class="auth-modal__title"></h2>
    <form class="auth-modal__form">
      <div class="auth-modal__form-group">
        <label
          for="auth-name"
          class="auth-modal__label"
          >Имя:</label
        >
        <input type="text" />
      </div>

      <div class="auth-modal__form-group">
        <label
          for="auth-password"
          class="auth-modal__label"
          >Пароль:</label
        >
        <input type="text" />
      </div>

      <div class="auth-modal__form-group">
        <label
          for="auth-avatar"
          class="auth-modal__label"
          >Аватар:</label
        >
        <input type="file" />
        <div class="auth-modal__avatar-preview">
          <img
            :src="avatar"
            alt="Аватар"
            class="auth-modal__avatar-image"
          />
        </div>
      </div>
      <div class="auth-modal__error"></div>
      <AppButton
        type="submit"
        class="auth-modal__submit"
      >
        {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
      </AppButton>
      <button>
        {{ isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
      </button>
    </form>
  </AppModal>
</template>

<style lang="scss" scoped></style>
