<script setup>
import { ref } from 'vue'
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const isLoginMode = ref(true)
const errorMessage = ref('')
const avatarUrl = ref('')

const formData = ref({
  name: '',
  password: '',
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
  avatarUrl.value = ''
}

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  if (!formData.value.name.trim() || !formData.value.password.trim()) {
    errorMessage.value = 'Заполните все поля'
    return
  }
  if (!isLoginMode.value && avatarUrl.value && !avatarUrl.value.startsWith('http')) {
    errorMessage.value = 'Укажите корректный URL (начинается с http/https)'
    return
  }

  console.log('Форма отправлена:', {
    mode: isLoginMode.value ? 'login' : 'register',
    ...formData.value,
    avatar: avatarUrl.value || null,
  })

  closeModal()
}
const handleAvatarError = () => {
  errorMessage.value = 'Не удалось загрузить изображение по указанному URL'
  avatarUrl.value = ''
}
</script>

<template>
  <AppModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <h2 class="auth-modal__title">{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
    <form
      class="auth-modal__form"
      @submit.prevent="handleSubmit"
    >
      <div class="auth-modal__form-group">
        <label
          for="auth-name"
          class="auth-modal__label"
          >Имя:</label
        >
        <input
          id="auth-name"
          v-model="formData.name"
          type="text"
          class="auth-modal__input"
          required
        />
      </div>

      <div class="auth-modal__form-group">
        <label
          for="auth-password"
          class="auth-modal__label"
          >Пароль:</label
        >
        <input
          id="auth-password"
          v-model="formData.password"
          type="password"
          class="auth-modal__input"
          required
        />
      </div>

      <div
        v-if="!isLoginMode"
        class="auth-modal__form-group"
      >
        <label
          for="auth-avatar-url"
          class="auth-modal__label"
          >Аватар (URL):</label
        >
        <input
          id="auth-avatar-url"
          v-model="avatarUrl"
          type="url"
          class="auth-modal__input"
          placeholder="https://example.com/avatar.jpg"
        />
        <div
          class="auth-modal__avatar-preview"
          v-if="avatarUrl"
        >
          <img
            :src="avatarUrl"
            alt="Аватар"
            class="auth-modal__avatar-image"
            @error="handleAvatarError"
          />
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="auth-modal__error"
      >
        {{ errorMessage }}
      </div>

      <div class="auth-modal__buttons">
        <AppButton
          type="submit"
          class="auth-modal__submit"
        >
          {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
        </AppButton>
        <button
          type="button"
          class="auth-modal__toggle-mode"
          @click="toggleMode"
        >
          {{ isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
        </button>
      </div>
    </form>
  </AppModal>
</template>

<style lang="scss" scoped>
.auth-modal {
  &__title {
    font-size: var(--font-size-xl);
    text-align: center;
    margin-bottom: var(--spacing-lg);
    color: var(--color-accent);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  &__label {
    font-size: var(--font-size-md);
  }

  &__input {
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-primary);
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
    font-size: var(--font-size-md);
  }

  &__avatar-preview {
    margin-top: var(--spacing-sm);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--color-primary);
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__error {
    color: #f44336;
    text-align: center;
    margin: var(--spacing-sm) 0;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__toggle-mode {
    background: none;
    border: none;
    color: var(--color-text);
    text-decoration: underline;
    cursor: pointer;
    font-size: var(--font-size-sm);
    padding: var(--spacing-sm) 0;

    &:hover {
      color: var(--color-accent);
    }
  }
}
</style>
