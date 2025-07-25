<script setup lang="ts">
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/AppModal.vue'
import GameHints from '@/components/game/GameHints.vue'
import PrizePyramid from '@/components/game/PrizePyramid.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAnswerLogic } from '@/composables/game/useAnswerLogic'
import { useQuestions } from '@/composables/game/useQuestions'
import { useGameStore } from '@/stores/gameStore'
import { ROUTE_PATHS } from '@/constants/routes'
import { useGameHints } from '@/composables/game/useGameHints'
import { useSoundStore } from '@/stores/soundStore'
import type { Question as QuizQuestion } from '@/types/game'
import { storeToRefs } from 'pinia'

const soundStore = useSoundStore()
const gameStore = useGameStore()

const showExitConfirmation = ref(false)

const { selectedAnswerId, showResult, prize, currentQuestionIndex, nextPrize } =
  storeToRefs(gameStore)

const { questions, isLoading, error, loadQuestions } = useQuestions()
const currentQuestion = computed<QuizQuestion | null>(
  () => questions.value?.[currentQuestionIndex.value] || null,
)

const { hints, hiddenAnswers, audiencePercentages, callFiftyFifty, useAudienceHelp, resetHints } =
  useGameHints(computed(() => currentQuestion.value?.answers || []))

const getAnswerPercentage = (answerId: number): number | null => {
  return audiencePercentages.value[answerId] || null
}

const { getAnswerClass, selectAnswer, showResultModal } = useAnswerLogic({
  questions,
  currentQuestionIndex,
  selectedAnswerId,
  showResult,
  prize,
  hiddenAnswers,
})

const checkCurrentQuestion = (): void => {
  const gameFinished = currentQuestionIndex.value >= questions.value.length - 1
  if (gameFinished) {
    gameStore.resetGameState()
    return
  }

  currentQuestionIndex.value++
  soundStore.resumeGameMusic()
  selectedAnswerId.value = null
  showResult.value = false
  hiddenAnswers.value = []
  audiencePercentages.value = {}
}

const playAgain = (): void => {
  gameStore.resetGameState()
  resetHints()
  showResultModal.value = false
  soundStore.playGame()
  loadQuestions()
}

const resetToHomeState = (): void => {
  soundStore.stopAll()
  gameStore.resetGameState()
  resetHints()
  questions.value = []
}

onMounted(() => {
  soundStore.playGame()
})

onUnmounted(() => {
  soundStore.stopAll()
})
</script>

<template>
  <div class="game-page">
    <div class="game-page__header">
      <AppButton @click="showExitConfirmation = true">На главную</AppButton>
      <div class="game-page__prize-info">
        <div>Текущий приз: {{ prize }} ₽</div>
        <div v-if="!showResult">Следующий приз: {{ nextPrize }} ₽</div>
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
    <div v-else-if="!currentQuestion">Подождите...</div>
    <div v-else>
      <div class="game-page__layout">
        <div class="game-page__content">
          <GameHints
            :hints="hints"
            :disabled="selectedAnswerId !== null"
            @callFiftyFifty="callFiftyFifty"
            @useAudienceHelp="useAudienceHelp"
          />
          <h2 class="game-page__question">{{ currentQuestion.text }}</h2>
          <div class="game-page__answers">
            <div
              v-for="{ id, text, isCorrect } in currentQuestion.answers"
              :key="id"
              @click="selectAnswer(id)"
              :class="['answer', getAnswerClass({ id, text, isCorrect })]"
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
            {{
              currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить игру'
            }}
          </AppButton>
        </div>
        <PrizePyramid :current-prize="prize" />
      </div>
    </div>

    <AppModal v-model="showResultModal">
      <div class="result-modal">
        <h2 class="result-modal__title">Не правильный ответ! Вы проиграли!</h2>
        <div class="result-modal__buttons">
          <AppButton @click="playAgain">Играть снова</AppButton>
          <router-link :to="ROUTE_PATHS.HOME">
            <AppButton @click="resetToHomeState">На главную</AppButton>
          </router-link>
        </div>
      </div>
    </AppModal>

    <AppModal v-model="showExitConfirmation">
      <div class="exit-confirmation">
        <h2 class="exit-confirmation__title">Подтверждение выхода</h2>
        <p class="exit-confirmation__message">
          Вы уверены, что хотите выйти из игры? Весь прогресс будет потерян.
        </p>
        <div class="exit-confirmation__buttons">
          <router-link :to="ROUTE_PATHS.HOME">
            <AppButton @click="resetToHomeState">Да, выйти</AppButton>
          </router-link>
          <AppButton @click="showExitConfirmation = false">Нет, остаться</AppButton>
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

  &__layout {
    display: flex;
    gap: var(--spacing-xl);
    flex-grow: 1;
  }

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

.exit-confirmation {
  text-align: center;
  padding: var(--spacing-xl);

  &__title {
    font-size: var(--font-size-xl);
    color: var(--color-accent);
    margin-bottom: var(--spacing-md);
  }

  &__message {
    margin-bottom: var(--spacing-xl);
    font-size: var(--font-size-lg);
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
