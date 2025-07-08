import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import gameTheme from '@/assets/sounds/game-theme.mp3'
import correctSound from '@/assets/sounds/correct-answer.mp3'
import wrongSound from '@/assets/sounds/wrong-answer.mp3'
import { ref, unref, computed } from 'vue'

type SoundTrack = 'main' | 'game' | null

export const useSoundStore = defineStore('sound', () => {
  const volume = ref(0.5)
  const soundEffectsEnabled = ref<boolean>(true)
  const backgroundMusicEnabled = ref<boolean>(true)
  const currentTrack = ref<SoundTrack>(null)
  const isGameMusicPaused = ref<boolean>(false)

  const canPlaySound = computed<boolean>(() => soundEffectsEnabled.value)
  const canPlayMusic = computed<boolean>(() => backgroundMusicEnabled.value)

  const soundEffects = {
    correct: useSound(correctSound, { volume: unref(volume), interrupt: true }),
    wrong: useSound(wrongSound, { volume: unref(volume), interrupt: true }),
  }

  const backgroundMusic = {
    main: useSound(mainTheme, { volume: unref(volume), interrupt: true, loop: false }),
    game: useSound(gameTheme, { volume: unref(volume), interrupt: true, loop: true }),
  }

  const playCorrectSound = (): void => canPlaySound.value && soundEffects.correct.play()
  const playWrongSound = (): void => canPlaySound.value && soundEffects.wrong.play()

  const playMain = (): void => {
    if (!canPlayMusic.value) return
    stopAll()
    backgroundMusic.main.play()
    currentTrack.value = 'main'
    isGameMusicPaused.value = false
  }

  const playGame = (): void => {
    if (!canPlayMusic.value) return
    stopAll()
    backgroundMusic.game.play()
    currentTrack.value = 'game'
    isGameMusicPaused.value = false
  }

  const pauseGameMusic = (): void => {
    backgroundMusic.game.pause()
    isGameMusicPaused.value = true
  }

  const resumeGameMusic = (): void => {
    if (isGameMusicPaused.value && canPlayMusic.value) {
      backgroundMusic.game.play()
      isGameMusicPaused.value = false
    }
  }

  const stopAll = (): void => {
    backgroundMusic.main.stop()
    backgroundMusic.game.stop()
    currentTrack.value = null
    isGameMusicPaused.value = false
  }

  return {
    volume,
    soundEffectsEnabled,
    backgroundMusicEnabled,
    currentTrack,
    isGameMusicPaused,
    playMain,
    playGame,
    pauseGameMusic,
    resumeGameMusic,
    playCorrectSound,
    playWrongSound,
    stopAll,
  }
})
