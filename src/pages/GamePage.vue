<script setup>
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/AppModal.vue'
import GameHints from '@/components/UI/GameHints.vue'
import { computed} from 'vue'
import { useAnswerLogic } from '@/composables/useAnswerLogic'
import { useQuestions } from '@/composables/useQuestions'
import { useGameState } from '@/composables/useGameState'
import { ROUTE_PATHS } from '@/constants/routes'
import { useGameHints } from '@/composables/useGameHints'

const { selectedAnswerId, showResult, prize, currentQuestionIndex, getNextPrize, resetGameState } =
  useGameState()
const { questions, isLoading, error, loadQuestions } = useQuestions()

const currentQuestion = computed(() => questions.value?.[currentQuestionIndex.value] || null)

const { hints, hiddenAnswers, audiencePercentages, useFiftyFifty, useAudienceHelp } = useGameHints(
  computed(() => currentQuestion.value?.answers || []),
)

const { getAnswerClass, selectAnswer, canGonextQuestion, showResultModal } = useAnswerLogic({
  questions,
  currentQuestionIndex,
  selectedAnswerId,
  showResult,
  prize,
  hiddenAnswers,
})

const getAnswerPercentage = (answerId) => {
  return audiencePercentages.value[answerId] || null
}

const checkCurrentQuestion = () => {
  const gameFinished = canGonextQuestion()
  if (gameFinished) {
    resetGameState()
    return
  }
  selectedAnswerId.value = null
  showResult.value = false
  hiddenAnswers.value = []
  audiencePercentages.value = {}
}

const playAgain = () => {
  resetGameState()
  showResultModal.value = false
  hiddenAnswers.value = []
  audiencePercentages.value = {}
  loadQuestions()
}
</script>
<template>
  <div class="game-page">
    <div class="game-page__header">
      <router-link :to="ROUTE_PATHS.HOME">
        <AppButton>На главную</AppButton>
      </router-link>
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
      <AppButton @click="loadQuestions">Повторить попытку</AppButton>
    </div>
    <div v-else-if="!currentQuestion">Нет данных для отображения</div>
    <div v-else>
      <div class="game-page__content">
        <GameHints
          :hints="hints"
          @useFiftyFifty="useFiftyFifty"
          @useAudienceHelp="useAudienceHelp"
        />

        <h2 class="game-page__question">{{ currentQuestion.text }}</h2>
        <div class="game-page__answers">
          <div
            v-for="{ id, text, isCorrect } in currentQuestion.answers"
            :key="id"
            @click="selectAnswer(id)"
            :class="['answer', getAnswerClass({ id, isCorrect })]"
          >
            {{ text }}
            <span
              v-if="getAnswerPercentage(id)"
              class="answer__percentage"
            >
              {{ getAnswerPercentage(id) }}%
            </span>
          </div>
        </div>

        <AppButton
          v-if="showResult"
          @click="checkCurrentQuestion"
          class="game-page__next-button"
        >
          {{ currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить игру' }}
        </AppButton>
      </div>
    </div>

    <AppModal v-model="showResultModal">
      <div class="result-modal">
        <h2 class="result-modal__title">Как жаль - вы проиграли!</h2>
        <div class="result-modal__buttons">
          <AppButton @click="playAgain">Играть снова</AppButton>
          <router-link :to="ROUTE_PATHS.HOME">
            <AppButton>На главную</AppButton>
          </router-link>
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

  &--hidden {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
    height: 0;
    padding: 0;
    margin: 0;
    border: none;
  }

  &__percentage {
    display: block;
    margin-top: var(--spacing-sm);
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    font-weight: bold;
  }

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
