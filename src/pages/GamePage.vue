<script setup>
import AppButton from '@/components/UI/AppButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { PRIZE_STEPS } from '@/constants/game';

const router = useRouter();

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value];
});

const nextQuestion = async () => {
  currentQuestionIndex.value++;
  if (currentQuestionIndex.value >= questions.value.length) {
    await router.push('/');
    console.log('Переход завершён');
  } else {
    selectedAnswerId.value = null;
    showResult.value = false;
  }
};
const selectAnswer = (answerId) => {
  if (showResult.value) return;
  selectedAnswerId.value = answerId;
  showResult.value = true;

  const selectedAnswer = currentQuestion.value.answers.find(a => a.id === answerId);
  if (selectedAnswer.isCorrect) {
    const currentLevel = PRIZE_STEPS.findIndex(step => step > prize.value);
    prize.value = currentLevel >= 0 ? PRIZE_STEPS[currentLevel] : PRIZE_STEPS[PRIZE_STEPS.length - 1];
  } else {
    prize.value = 0;
  }
};

const exitGame = () => {
  prize.value = 0;
  router.push('/')
}

const getAnswerClass = (answer) => {
  if (!showResult.value) {
    return selectedAnswerId.value === answer.id ? 'answer--selected' : '';
  }
  if (answer.isCorrect) return 'answer--correct';
  if (selectedAnswerId.value === answer.id && !answer.isCorrect) return 'answer--incorrect';
  return '';
};
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
            :class="['answer', getAnswerClass(answer)]"> {{ answer.text }}</div>
        </div>
        <AppButton v-if="showResult" @click="nextQuestion" class="game-page__next-button">{{ currentQuestionIndex <
          questions.length - 1 ? 'Следующий вопрос' : 'Завершить игру' }} </AppButton>
      </div>
    </div>

  </div>
</template>

<style lang='scss' scoped>
.game-page {
  padding: var(--spacing-xl);
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    margin-bottom: var(--spacing-xl);
  }

  .game-page {
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

  &__next-button {
    margin-top: var(--spacing-lg);
  }
}

.answer {
  padding: var(--spacing-md);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(var(--color-primary), 0.1);

  &:hover {
    background: rgba(var(--color-primary), 0.3);
  }

  &--selected {
    background: var(--color-primary);
    color: var(--color-text);
  }

  &--correct {
    background: #4CAF50;
    border-color: #4CAF50;
    color: var(--color-text);
  }

  &--incorrect {
    background: #F44336;
    border-color: #F44336;
    color: var(--color-text);
  }
}
</style>