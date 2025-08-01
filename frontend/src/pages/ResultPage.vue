<script lang="ts" setup>
import AppButton from '@/components/UI/AppButton.vue'
import { ROUTE_PATHS } from '@/constants/routes'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import { useSoundStore } from '@/stores/soundStore'
import { onMounted, onUnmounted } from 'vue'

const gameStore = useGameStore()
const authStore = useAuthStore()
const soundStore = useSoundStore()

const playAgain = ():void => {
  soundStore.stopAll()
  gameStore.resetGameState()
  gameStore.resetGameState()
  soundStore.playGame()
}

const resetToHomeState = ():void => {
  soundStore.stopAll()
  gameStore.resetGameState()
  soundStore.playMain()
}

onMounted(() => {
  soundStore.stopAll()
  soundStore.playResult()
})

onUnmounted(() => {
  soundStore.stopAll()
})
</script>
<template>
  <div class="result-page">
    <div class="result-page__content">
      <h1 class="result-page__title">Поздравляем!</h1>
      <div class="result-page__subtitle">Вы Выиграли</div>
      <div class="result-page__prize">{{ gameStore.prize }} ₽</div>
      <div class="result-page__user-info">
        <div class="result-page__avatar-wrapper">
          <img
            :src="authStore.currentUser?.avatar || '/default-avatar.png'"
            :alt="authStore.currentUser?.name || 'Гость'"
            class="result-page__avatar"
          />
        </div>
        <div class="result-page__username">{{ authStore.currentUser?.name || 'Гость' }}</div>
      </div>
      <div class="result-page__buttons">
        <router-link :to="ROUTE_PATHS.GAME">
          <AppButton @click="playAgain">Играть снова</AppButton>
        </router-link>
        <router-link :to="ROUTE_PATHS.HOME">
          <AppButton @click="resetToHomeState">На главную</AppButton>
        </router-link>
      </div>
    </div>
    <div class="result-page__confetti">
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.result-page {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));

  &__content {
    text-align: center;
    max-width: 800px;
    width: 100%;
    padding: var(--spacing-xl);
    background: rgba(var(--color-bg), 0.9);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    position: relative;
    z-index: 2;
  }
  &__title {
    font-size: var(--font-size-xxl);
    color: var(--color-accent);
    margin-bottom: var(--spacing-md);
    text-transform: uppercase;
  }

  &__subtitle {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
  }

  &__prize {
    font-size: 4rem;
    font-weight: bold;
    color: #ffd700;
    margin-bottom: var(--spacing-xl);
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
  }

  &__avatar-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--color-accent);
  }

  &__avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__username {
    font-size: var(--font-size-lg);
    color: var(--color-text);
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  &__confetti {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
  }
}
.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  opacity: 0;
  animation: confetti 5s ease-in-out infinite;

  &:nth-child(1) {
    left: 10%;
    animation-delay: 0s;
    background: #ffd700;
  }

  &:nth-child(2) {
    left: 20%;
    animation-delay: 0.5s;
    background: #ff0000;
  }

  &:nth-child(3) {
    left: 30%;
    animation-delay: 1.2s;
    background: #00ff00;
  }

  &:nth-child(4) {
    left: 40%;
    animation-delay: 0.8s;
    background: #0000ff;
  }

  &:nth-child(5) {
    left: 50%;
    animation-delay: 1.5s;
    background: #ff00ff;
  }

  &:nth-child(6) {
    left: 60%;
    animation-delay: 0.3s;
    background: #00ffff;
  }

  &:nth-child(7) {
    left: 70%;
    animation-delay: 1s;
    background: #ffff00;
  }

  &:nth-child(8) {
    left: 80%;
    animation-delay: 0.7s;
    background: #ff9900;
  }

  &:nth-child(9) {
    left: 90%;
    animation-delay: 1.3s;
    background: #9900ff;
  }

  &:nth-child(10) {
    left: 100%;
    animation-delay: 0.2s;
    background: #ff0099;
  }
}

@keyframes confetti {
  0% {
    opacity: 0;
    top: -10px;
    transform: rotate(0deg) scale(1);
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    top: 100%;
    transform: rotate(360deg) scale(0.5);
  }
}
</style>
