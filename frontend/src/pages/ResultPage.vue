<script lang="ts" setup>
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>
<template>
  <div class="result-page">
    <div class="result-page__content">
      <h1 class="result-page__title">Поздравляем!</h1>
      <div class="result-page__subtitle">Вы Выиграли</div>
      <div class="result-page__prize">{{ gameStore.prize }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
