<script setup>
import AppButton from '@/components/UI/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const exitGame = () => {
  router.push('/')
}
</script>
<template>
  <AppButton @click="exitGame">На главную</AppButton>
</template>

<style lang='scss' scoped>
@use '@/assets/styles/variables' as *;
</style>