<script setup>
import { ref } from 'vue'
import AppModal from '@/components/UI/AppModal.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { ROUTE_PATHS } from '@/constants/routes'
import { useLocalStorage } from '@vueuse/core'

const isRulesModalOpen = ref(false)
const isSettingsModalOpen = ref(false)
const soundEnabled = useLocalStorage('gameSettings.soundEnabled', true)
const musicEnabled = useLocalStorage('gameSettings.musicEnabled', true)
</script>

<template>
  <div class="welcome-page">
    <div class="welcome-page__content">
      <h1 class="welcome-page__title">Кто хочет стать миллионером?</h1>
      <p class="welcome-page__subtitle">Проверьте свои знания!</p>

      <div class="welcome-page__buttons">
        <router-link :to="ROUTE_PATHS.GAME">
          <AppButton>Начать игру</AppButton>
        </router-link>
        <AppButton @click="isRulesModalOpen = true">Правила игры</AppButton>
        <AppButton @click="isSettingsModalOpen = true">Настройки</AppButton>
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
      <div class="modal-settings">
        <label class="setting-item">
          <input
            type="checkbox"
            v-model="soundEnabled"
          />
          Звуковые эффекты
        </label>
        <label class="setting-item">
          <input
            type="checkbox"
            v-model="musicEnabled"
          />
          Фоновая музыка
        </label>
      </div>
    </AppModal>
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
</style>
