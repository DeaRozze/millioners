<script setup>
import AppButton from '@/components/UI/AppButton.vue';
import { computed } from 'vue';
import { useAnswerLogic } from '@/composables/useAnswerLogic';
import { useQuestions } from '@/composables/useQuestions';
import { useNavigation } from '@/composables/useNavigation';
import { useGameState } from '@/composables/useGameState';

const gameState = useGameState();
const questionsState = useQuestions()
const navigation = useNavigation()

// деструкт
const { selectedAnswerId, showResult, prize, currentQuestionIndex, getNextPrize, resetGameState } = gameState;
const { questions, isLoading, error } = questionsState
const { navigateToHome } = navigation

// текущий вопрос
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// вся логика ответов
const answerLogic = useAnswerLogic(questions, currentQuestionIndex, selectedAnswerId, showResult, prize)
const { getAnswerClass, selectAnswer, nextQuestion } = answerLogic;

const handleNextQuestion = () => {
  const gameFinished = nextQuestion();
  if (gameFinished) {
    navigateToHome();
    console.log('игра зверешена!');
  } else {
    selectedAnswerId.value = null;
    showResult.value = false
  }
}

const exitGame = () => {
  resetGameState();
  navigateToHome();
}
</script>
<template>
  <div class="game-page">
    <div class="game-page__header">
      <AppButton @click="exitGame">На главную</AppButton>
      <div class="game-page__prize-info">
        <div>Текущий приз: {{ prize }} ₽</div>
        <div v-if="!showResult">Следующий приз: {{ getNextPrize() }} ₽</div>
      </div>
    </div>
    <div v-if="isLoading">Загрузка вопросов...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!currentQuestion">Нет данных для отображения</div>
    <div v-else>
      <div class="game-page__content">
        <h2 class="game-page__question">{{ currentQuestion.text }}</h2>
        <div class="game-page__answers">
          <div v-for="answer in currentQuestion.answers" :key='answer' @click="selectAnswer(answer.id)"
            :class="['answer', getAnswerClass(answer)]"> {{ answer.text }}
          </div>
        </div>
        <AppButton v-if="showResult" @click="handleNextQuestion" class="game-page__next-button">{{ currentQuestionIndex
          < questions.length - 1 ? 'Следующий вопрос' : 'Завершить игру' }} </AppButton>
      </div>
    </div>

  </div>
</template>

<style lang='scss' scoped>
.game-page {
  padding: var(--spacing-xl);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }

  &__prize-info {
    text-align: right;

    div:first-child {
      font-size: var(--font-size-lg);
      color: var(--color-accent);
      font-weight: bold;
    }

    div:last-child {
      font-size: var(--font-size-md);
      color: rgba(var(--color-text), 0.8);
    }
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
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-xl);
    text-align: center;
    color: var(--color-accent);
  }

  &__answers {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  .game-page__next-button {
    margin-top: var(--spacing-lg);
    animation: fadeInUp 0.5s ease-out;
  }
}

.answer {
  padding: var(--spacing-md);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  cursor: pointer;
  text-align: center;
  transition: all 0.5s ease;
  background: rgba(var(--color-primary), 0.1);
  position: relative;
  overflow: hidden;

  &--processing {
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(to bottom right,
          rgba(255, 255, 255, 0) 45%,
          rgba(255, 255, 255, 0.8) 50%,
          rgba(255, 255, 255, 0) 55%);
      animation: shimmer 2s infinite linear;
      transform: rotate(30deg);
    }
  }

  &:hover {
    background: rgba(var(--color-primary), 0.3);
  }

  &--selected {
    background: var(--color-primary);
    color: var(--color-text);
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(var(--color-accent), 0.5);
  }

  &--correct {
    background: #4CAF50;
    border-color: #4CAF50;
    color: var(--color-text);
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.7);
  }

  &--incorrect {
    background: #F44336;
    border-color: #F44336;
    color: var(--color-text);
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(244, 67, 54, 0.7);
  }

  &:hover:not(&--selected, &--correct, &--incorrect) {
    background: rgba(var(--color-primary), 0.3);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(30deg);
  }

  100% {
    transform: translateX(100%) rotate(30deg);
  }
}

.error {
  color: #F44336;
  text-align: center;
  font-size: var(--font-size-lg);
}
</style>