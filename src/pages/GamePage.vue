<script setup>
import AppButton from '@/components/UI/AppButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchQuestions } from '@/api/quizApi';

const router = useRouter();
const questions = ref([]);
const selectedAnswerId = ref(null);
const showResult = ref(false);
const isLoading = ref(true);
const error = ref(null);
const prize = ref(0)
const prizeSteps = [100, 500, 1000, 2000, 5000, 25000, 50000, 100000, 500000, 1000000];

onMounted(async () => {
  try {
    questions.value = await fetchQuestions();
    if (questions.value.length === 0) {
      error.value = "Вопросы не загружены. Попробуйте позже.";
    }
  } catch (err) {
    error.value = "Ошибка загрузки вопросов: " + err.message;
  } finally {
    isLoading.value = false;
  }
});

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value];
});
const nextQuestion = () => {
  currentQuestionIndex.value++;
  if (currentQuestionIndex.value >= questions.value.length) {
    router.push('/');
  } else {
    selectedAnswerId.value = null;
    showResult.value = false;
  }
};
const selectAnswer = (answerId) => {
  if (showResult.value) return;
  selectedAnswerId.value = answerId;
  showResult.value = true

  const selectedAnswer = currentQuestion.value.answers.find(a => a.id === answerId)
  if (selectedAnswer.isCorrect) {
    prize.value = prizeSteps[currentQuestionIndex.value];
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
      <div class="game-page__prize">Текущий приз: {{ prize }}</div>
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
@use '@/assets/styles/variables' as *;

.game-page {
  padding: $spacing-xl;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    margin-bottom: $spacing-xl;
  }

  &__prize {
    font-size: $font-size-lg;
    color: $color-accent;
    font-weight: bold;
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