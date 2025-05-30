<script setup>
const emit = defineEmits(['start-game'])

const handleStartGame = () => {
  emit('start-game')
}
</script>

<template>
  <div class="welcome-page">
    <div class="welcome-page__content">
      <h1 class="welcome-page__title">Кто хочет стать миллионером?</h1>
      <p class="welcome-page__subtitle">Проверьте свои знания!</p>
      <button class="welcome-page__button" @click="handleStartGame">
        Начать игру
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use 'sass:color';

.welcome-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    $color-bg;

  &__content {
    text-align: center;
    max-width: 800px;
    padding: $spacing-large;
  }

  &__title {
    font-size: $font-size-title;
    color: $color-accent;
    margin-bottom: $spacing-medium;
    text-shadow: $box-shadow;
  }

  &__subtitle {
    font-size: $font-size-subtitle;
    margin-bottom: $spacing-large;
  }

  &__button {
    padding: $spacing-medium $spacing-large;
    background: $color-primary;
    color: $color-text;
    border: none;
    border-radius: $border-radius;
    font-size: $font-size-text;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: $box-shadow;

    &:hover {
      background: color.adjust($color-primary, $lightness: 10%);
      transform: translateY(-2px);
    }
  }
}
</style>