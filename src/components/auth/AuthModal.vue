<script setup>
import AppModal from '@/components/UI/AppModal.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { useAuth } from '@/composables/auth/useAuth'
import { useTimers } from '@/composables/utils/useTimers'
import { useAuthForm } from '@/composables/auth/useAuthForm'
import { useSoundStore } from '@/stores/soundStore'

const soundStore = useSoundStore()

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'auth-success'])

const { currentUser, errorMessage, successMessage, avatarFile, openFileDialog, login, register } =
  useAuth()

const { setTimer } = useTimers()

const { isLoginMode, formData, toggleMode } = useAuthForm()

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleAuthSuccess = () => {
  setTimer(() => {
    closeModal()
    emit('auth-success', currentUser.value)
    soundStore.playMain()
  }, 1500)
}

const handleSubmit = () => {
  const { name, password } = formData.value

  if (isLoginMode.value) {
    if (login(name, password)) {
      handleAuthSuccess()
    }
  } else {
    if (register(name, password)) {
      handleAuthSuccess()
    }
  }
}

const triggerFileInput = () => {
  openFileDialog()
}

const signalAvatarError = () => {
  errorMessage.value = 'Не удалось загрузить изображение'
  avatarFile.value = null
}
</script>

<template>
  <AppModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <h2 class="auth-modal__title">{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
    <div
      v-if="successMessage"
      class="auth-modal__success"
    >
      {{ successMessage }}
    </div>
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
        class="auth-modal__form-group avatar-upload-group"
      >
        <label class="auth-modal__label">Аватар:</label>
        <div class="avatar-upload-container">
          <div
            class="avatar-preview-wrapper"
            @click="triggerFileInput"
          >
            <div
              v-if="!avatarFile"
              class="avatar-placeholder"
            >
              <span class="placeholder-icon">👤</span>
              <span class="placeholder-text">Нажмите для загрузки</span>
            </div>
            <img
              v-else
              :src="avatarFile"
              alt="Превью аватара"
              class="avatar-preview"
              @error="signalAvatarError"
            />
          </div>
          <AppButton
            type="button"
            class="avatar-upload-button"
            @click="triggerFileInput"
          >
            Выбрать файл
          </AppButton>
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
  &__input[type='file'] {
    padding: var(--spacing-sm) 0;
    border: none;
    background: transparent;
    color: var(--color-text);

    &::file-selector-button {
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius);
      border: 1px solid var(--color-primary);
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

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

  &__success {
    color: #4caf50;
    text-align: center;
    margin: var(--spacing-sm) 0;
    font-weight: bold;
  }
}
.avatar-upload-group {
  margin-top: var(--spacing-md);
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar-preview-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px dashed var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(var(--color-primary), 0.05);

  &:hover {
    border-color: var(--color-accent);
    background-color: rgba(var(--color-primary), 0.1);
    transform: scale(1.02);
  }
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--spacing-sm);

  .placeholder-icon {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-xs);
  }

  .placeholder-text {
    font-size: var(--font-size-sm);
    line-height: 1.3;
  }
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload-button {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  background: rgba(var(--color-primary), 0.1);

  &:hover {
    background: rgba(var(--color-primary), 0.2);
  }
}
</style>
