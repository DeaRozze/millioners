<script setup>
import WelcomePage from '@/pages/WelcomePage.vue'

const startGame = () => {
  console.log('Игра началась!')
  // Здесь позже будет переход на экран игры
}
</script>

<template>
  <WelcomePage @start-game="startGame" />
</template>

<style lang="scss">
@use '@/assets/styles/main';  
</style>
