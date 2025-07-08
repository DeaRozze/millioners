import { PRIZE_STEPS } from '@/constants/game'
import { ref, Ref } from 'vue'
import { useSoundStore } from '@/stores/soundStore'

interface Answer {
  id: number
  text: string
  isCorrect: boolean
}

interface Question {
  question: string
  answers: Answer[]
}

interface UseAnswerLogicProps {
  questions: Ref<Question[]>
  selectedAnswerId: Ref<number | null>
  showResult: Ref<boolean>
  prize: Ref<number>
  currentQuestionIndex: Ref<number>
  hiddenAnswers?: Ref<number[]>
}

export function useAnswerLogic(props: UseAnswerLogicProps) {
  const isProcessing = ref(false)
  const showResultModal = ref(false)
  const soundStore = useSoundStore()

  const getAnswerClass = (answer: Answer): string => {
    if (props.hiddenAnswers?.value?.includes(answer.id)) return 'answer--hidden'
    if (isProcessing.value && props.selectedAnswerId.value === answer.id) {
      return 'answer--selected answer--processing'
    }
    if (!props.showResult.value) {
      return props.selectedAnswerId.value === answer.id ? 'answer--selected' : ''
    }
    if (answer.isCorrect) return 'answer--correct'
    if (props.selectedAnswerId.value === answer.id && !answer.isCorrect) return 'answer--incorrect'
    return ''
  }

  const selectAnswer = async (answerId: number): Promise<void> => {
    if (
      props.showResult.value ||
      isProcessing.value ||
      props.hiddenAnswers?.value?.includes(answerId)
    )
      return

    soundStore.pauseGameMusic()
    props.selectedAnswerId.value = answerId
    isProcessing.value = true

    await new Promise((resolve) => setTimeout(resolve, 1000))

    isProcessing.value = false
    props.showResult.value = true

    const currentQuestion = props.questions.value[props.currentQuestionIndex.value]
    const selectedAnswer = currentQuestion.answers.find((a) => a.id === answerId)

    if (!selectedAnswer) return

    soundStore[selectedAnswer.isCorrect ? 'playCorrectSound' : 'playWrongSound']()

    if (selectedAnswer.isCorrect) {
      const currentLevel = PRIZE_STEPS.findIndex((step) => step > props.prize.value)
      props.prize.value =
        currentLevel >= 0 ? PRIZE_STEPS[currentLevel] : PRIZE_STEPS[PRIZE_STEPS.length - 1]
    } else {
      props.prize.value = 0
      showResultModal.value = true
    }
  }

  const canGonextQuestion = (): boolean => {
    props.currentQuestionIndex.value++
    return props.currentQuestionIndex.value >= props.questions.value.length
  }

  return {
    getAnswerClass,
    selectAnswer,
    canGonextQuestion,
    isProcessing,
    showResultModal,
  }
}
