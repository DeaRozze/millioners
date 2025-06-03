<script setup>
import AppButton from '@/components/UI/AppButton.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const questions = [
  {
    id: 1,
    text: 'Столица России?',
    answers: [
      { id: 1, text: 'Санкт-Петербург', isCorrect: false },
      { id: 2, text: 'Москва', isCorrect: true },
      { id: 3, text: 'Новосибирск', isCorrect: false },
      { id: 4, text: 'Казань', isCorrect: false }
    ]
  },
  {
    id: 2,
    text: 'Самая длинная река в мире?',
    answers: [
      { id: 1, text: 'Нил', isCorrect: false },
      { id: 2, text: 'Амазонка', isCorrect: true },
      { id: 3, text: 'Янцзы', isCorrect: false },
      { id: 4, text: 'Миссисипи', isCorrect: false }
    ]
  }
]

const router = useRouter()
const currentQuestionIndex = ref(0)
const selectedAnswerId = ref(null)
const showResult = ref(false)
const currentQuestion = ref(questions[currentQuestionIndex.value])

const selectAnswer = (answerId) => {
  if (showResult.value) return
  selectedAnswerId.value = answerId
  showResult.value = true
}

const nextQuestion = () => {
  currentQuestionIndex.value++
  if (currentQuestionIndex.value < questions.length) {
    currentQuestion.value = questions[currentQuestionIndex.value]
    selectedAnswerId.value = null
    showResult.value = false
  } else {
    // Все вопросы закончились
    router.push('/')
  }
}

const exitGame = () => {
  router.push('/')
}
</script>
<template>
  <div class="game-page">
    <div class="game-page__header">
      <AppButton @click="exitGame">На главную</AppButton>
    </div>
    <div class="game-page__content">
      <h2 class="game-page__question">{{ currentQuestion.text }}</h2>
      <div class="game-page__answers">
        <div v-for='answer in currentQuestion.answers' :key='answer.id' class="answer" :class="{
          'answer--selected': selectedAnswerId === answer.id,
          'answer--correct': showResult && answer.isCorrect,
          'answer--incorrect': showResult && selectedAnswerId === answer.id && !answer.isCorrect
        }" @click="selectAnswer(answer.id)"> {{ answer.text }}</div>
      </div>
      <AppButton v-if="showResult" @click="nextQuestion" class="game-page__next-button">{{ currentQuestionIndex <
        questions.length - 1 ? 'Следующий вопрос' : 'Завершить игру' }} </AppButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
@use '@/assets/styles/variables' as *;

.game-page {
  padding: $spacing-xl;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    margin-bottom: $spacing-xl;
  }

  &__content {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__question {
    font-size: $font-size-xl;
    margin-bottom: $spacing-xl;
    text-align: center;
    color: $color-accent;
  }

  &__answers {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__next-button {
    margin-top: $spacing-lg;
  }
}

.answer {
  padding: $spacing-md;
  border: 2px solid $color-primary;
  border-radius: $border-radius;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba($color-primary, 0.1);

  &:hover {
    background: rgba($color-primary, 0.3);
  }

  &--selected {
    background: $color-primary;
    color: $color-text;
  }

  &--correct {
    background: #4CAF50;
    border-color: #4CAF50;
    color: $color-text;
  }

  &--incorrect {
    background: #F44336;
    border-color: #F44336;
    color: $color-text;
  }
}
</style>