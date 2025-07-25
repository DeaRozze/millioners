<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import AppModal from '@/components/UI/AppModal.vue'
import AppButton from '@/components/UI/AppButton.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import MainUserAvatar from '@/components/avatar/MainUserAvatar.vue'
import { ROUTE_PATHS } from '@/constants/routes'
import { useSoundStore } from '@/stores/soundStore'
import { useAuthStore } from '@/stores/authStore'

const soundStore = useSoundStore()
const authStore = useAuthStore()
const isRulesModalOpen = ref<boolean>(false)
const isSettingsModalOpen = ref<boolean>(false)
const isAuthModalOpen = ref<boolean>(false)

const soundEffectsEnabled = ref<boolean>(soundStore.soundEffectsEnabled)
const backgroundMusicEnabled = ref<boolean>(soundStore.backgroundMusicEnabled)

watch(soundEffectsEnabled, (enabled: boolean) => {
  soundStore.soundEffectsEnabled = enabled
})

watch(backgroundMusicEnabled, (enabled: boolean) => {
  soundStore.backgroundMusicEnabled = enabled
  if (!enabled) soundStore.stopAll()
})

const updateVolume = (event: Event): void => {
  const target = event.target as HTMLInputElement
  soundStore.volume = parseFloat(target.value)
}

const playMainSoundOnAuth = (): void => {
  soundStore.playMain()
}

const openAuthModal = (): void => {
  authStore.isLoginMode = true
  authStore.resetAuthForm()
  isAuthModalOpen.value = true
}

onUnmounted(() => {
  soundStore.stopAll()
})
</script>

<template>
  <div class="welcome-page">
    <div class="welcome-page__content">
      <h1 class="welcome-page__title">Кто хочет стать миллионером?</h1>
      <p class="welcome-page__subtitle">Проверьте свои знания!</p>
      <div class="welcome-page__header">
        <MainUserAvatar />
      </div>

      <div class="welcome-page__buttons">
        <router-link :to="ROUTE_PATHS.GAME">
          <AppButton>Начать игру</AppButton>
        </router-link>
        <AppButton @click="isRulesModalOpen = true">Правила игры</AppButton>
        <AppButton @click="isSettingsModalOpen = true">Настройки</AppButton>
        <AppButton @click="openAuthModal">Войти/Регистрация</AppButton>
      </div>
    </div>

    <AppModal v-model="isRulesModalOpen">
      <h2 class="modal-title">Правила игры</h2>
      <ul class="modal-list">
        <li>15 вопросов возрастающей сложности</li>
        <li>4 варианта ответа, только 1 верный</li>
        <li>3 подсказки: 50/50, звонок другу, помощь зала</li>
      </ul>
    </AppModal>

    <AppModal v-model="isSettingsModalOpen">
      <h2 class="modal-title">Настройки</h2>
      <div class="settings-container">
        <div class="setting-item">
          <label class="setting-label">
            <input
              type="checkbox"
              v-model="soundEffectsEnabled"
              class="setting-checkbox"
            />
            Звуки ответов
          </label>
        </div>

        <div class="setting-item">
          <label class="setting-label">
            <input
              type="checkbox"
              v-model="backgroundMusicEnabled"
              class="setting-checkbox"
            />
            Фоновая музыка
          </label>
        </div>

        <div
          class="setting-item"
          v-if="backgroundMusicEnabled"
        >
          <label class="setting-label">Громкость музыки</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="soundStore.volume"
            @input="updateVolume"
            class="volume-slider"
          />
          <span class="volume-value">{{ Math.round(soundStore.volume * 100) }}%</span>
        </div>
      </div>
    </AppModal>

    <AuthModal
      v-model="isAuthModalOpen"
      @auth-success="playMainSoundOnAuth"
    />
  </div>
</template>

<style lang="scss" scoped>
.welcome-page {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
  padding: var(--spacing-xl);

  &__header {
    position: absolute;
    top: var(--spacing-xl);
    right: var(--spacing-xl);
  }

  &__content {
    text-align: center;
    max-width: 800px;
    width: 100%;
    padding: var(--spacing-xl);
  }

  &__title {
    font-size: var(--font-size-xxl);
    color: var(--color-accent);
    margin-bottom: var(--spacing-lg);
    text-shadow: var(--box-shadow);
  }

  &__subtitle {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xl);
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.setting-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-md);
}

.setting-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.volume-slider {
  width: 100%;
  cursor: pointer;
}

.volume-value {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
