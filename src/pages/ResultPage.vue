<script setup>
import AppButton from '@/components/UI/AppButton.vue';
import { useGameState } from '@/composables/useGameState';
import { ROUTE_PATHS } from '@/constants/routes';
import { useRouter } from 'vue-router';
const router = useRouter();
const { resetGameState } = useGameState()

const playAgain = () => {
  resetGameState();
  router.push(ROUTE_PATHS.GAME)
}

const goToHome = () => {
  resetGameState();
  router.push(ROUTE_PATHS.HOME)
}
</script>

<template>
  <div class="result-page">
    <div class="result-page__content">
      <h1 class="result-page__title">Как жаль - вы проиграли!</h1>
      <div class="result-page__buttons">
        <AppButton @click='playAgain'>Играть снова</AppButton>
        <AppButton @click='goToHome'>На главную</AppButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.result-page {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);

  &__content {
    text-align: center;
    max-width: 800px;
    width: 100%;
    padding: var(--spacing-xl);
    background: rgba(0, 0, 0, 0.7);
    border-radius: var(--border-radius);
  }

  &__title {
    font-size: var(--font-size-xxl);
    color: #F44336;
    margin-bottom: var(--spacing-xl);
  }

  &__prize {
    font-size: var(--font-size-xl);
    color: var(--color-accent);
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