<script setup>
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/AppModal.vue'
import { computed} from 'vue'
import { useAnswerLogic } from '@/composables/useAnswerLogic'
import { useQuestions } from '@/composables/useQuestions'
import { useNavigation } from '@/composables/useNavigation'
import { useGameState } from '@/composables/useGameState'

const {
  selectedAnswerId,
  showResult,
  prize,
  currentQuestionIndex,
  getNextPrize,
  resetGameState,
} = useGameState()
const { questions, isLoading, error } = useQuestions()
const { navigateToHome } = useNavigation()

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const { getAnswerClass, selectAnswer, canGonextQuestion, showResultModal } = useAnswerLogic(
  questions,
  currentQuestionIndex,
  selectedAnswerId,
  showResult,
  prize,
)

const checkCurrentQuestion = () => {
  const gameFinished = canGonextQuestion()
  if (gameFinished) {
    resetGameState()
    navigateToHome()
    return
  }
  selectedAnswerId.value = null
  showResult.value = false
}

const exitGame = () => {
  resetGameState()
  navigateToHome()
}

const playAgain = () => {
  resetGameState()
  showResultModal.value = false
}
const goToHome = () => {
  resetGameState()
  navigateToHome()
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
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <div v-else-if="!currentQuestion">Нет данных для отображения</div>
    <div v-else>
      <div class="game-page__content">
        <h2 class="game-page__question">{{ currentQuestion.text }}</h2>
        <div class="game-page__answers">
          <div
            v-for="answer in currentQuestion.answers"
            :key="answer"
            @click="selectAnswer(answer.id)"
            :class="['answer', getAnswerClass(answer)]"
          >
            {{ answer.text }}
          </div>
        </div>
        <AppButton
          v-if="showResult"
          @click="checkCurrentQuestion"
          class="game-page__next-button"
          >{{ currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить игру' }}
        </AppButton>
      </div>
    </div>
    <AppModal v-model="showResultModal">
      <div class="result-modal">
        <h2 class="result-modal__title">Как жаль - вы проиграли!</h2>
        <div class="result-modal__buttons">
          <AppButton @click="playAgain">Играть снова</AppButton>
          <AppButton @click="goToHome">На главную</AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style lang="scss" scoped>
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
      background: linear-gradient(
        to bottom right,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(255, 255, 255, 0) 55%
      );
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
    background: #4caf50;
    border-color: #4caf50;
    color: var(--color-text);
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.7);
  }

  &--incorrect {
    background: #f44336;
    border-color: #f44336;
    color: var(--color-text);
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(244, 67, 54, 0.7);
  }

  &:hover:not(&--selected, &--correct, &--incorrect) {
    background: rgba(var(--color-primary), 0.3);
  }
}

.result-modal {
  text-align: center;
  padding: var(--spacing-xl);

  &__title {
    font-size: var(--font-size-xxl);
    color: #f44336;
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(30deg);
  }

  100% {
    transform: translateX(100%) rotate(30deg);
  }
}

.error {
  color: #f44336;
  text-align: center;
  font-size: var(--font-size-lg);
}
</style>
