<script setup>
import { ref } from 'vue'
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/AppModal.vue'

const rulesModal = ref(null)
const settingsModal = ref(null)
const soundEnabled = ref(true)
const musicEnabled = ref(true)

const startGame = () => {
  console.log('Игра началась!')
}
</script>

<template>
  <div class="welcome-page">
    <div class="welcome-page__content">
      <h1 class="welcome-page__title">Кто хочет стать миллионером?</h1>
      <p class="welcome-page__subtitle">Проверьте свои знания!</p>

      <div class="welcome-page__buttons">
        <AppButton @click="startGame">Начать игру</AppButton>
        <AppButton @click="rulesModal.open()" :primary="false">Правила игры</AppButton>
        <AppButton @click="settingsModal.open()" :primary="false">Настройки</AppButton>
      </div>
    </div>

    <AppModal ref="rulesModal">
      <h2 class="modal-title">Правила игры</h2>
      <ul class="modal-list">
        <li>15 вопросов возрастающей сложности</li>
        <li>4 варианта ответа, только 1 верный</li>
        <li>3 подсказки: 50/50, звонок другу, помощь зала</li>
        <li>Несгораемые суммы на 5, 10 и 15 вопросах</li>
      </ul>
    </AppModal>

    <AppModal ref="settingsModal">
      <h2 class="modal-title">Настройки</h2>
      <div class="modal-settings">
        <label class="setting-item">
          <input type="checkbox" v-model="soundEnabled">
          Звуковые эффекты
        </label>
        <label class="setting-item">
          <input type="checkbox" v-model="musicEnabled">
          Фоновая музыка
        </label>
      </div>
    </AppModal>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.welcome-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), $color-bg;
  padding: $spacing-xl; // Исправлено с large на xl

  &__content {
    text-align: center;
    max-width: 800px;
    width: 100%;
    padding: $spacing-xl; // Исправлено с large на xl
  }

  &__title {
    font-size: $font-size-xxl;
    color: $color-accent;
    margin-bottom: $spacing-lg;
    text-shadow: $box-shadow;
  }

  &__subtitle {
    font-size: $font-size-lg;
    margin-bottom: $spacing-xl;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
