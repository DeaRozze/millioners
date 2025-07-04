import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import gameTheme from '@/assets/sounds/game-theme.mp3'
import correctSound from '@/assets/sounds/correct-answer.mp3'
import wrongSound from '@/assets/sounds/wrong-answer.mp3'
import { ref, computed } from 'vue'

export const useSoundStore = defineStore('sound', () => {
  const volume = ref(0.5)
  const soundEffectsEnabled = ref(true)
  const backgroundMusicEnabled = ref(true)
  const currentTrack = ref(null)
  const isGameMusicPaused = ref(false)

  const canPlaySound = computed(() => soundEffectsEnabled.value)
  const canPlayMusic = computed(() => backgroundMusicEnabled.value)

  // Sound effects
  const soundEffects = {
    correct: useSound(correctSound, { volume, interrupt: true }),
    wrong: useSound(wrongSound, { volume, interrupt: true })
  }

  // Background music
  const backgroundMusic = {
    main: useSound(mainTheme, { volume, interrupt: true, loop: true }),
    game: useSound(gameTheme, { volume, interrupt: true, loop: true })
  }

  // Public methods
  const playCorrectSound = () => canPlaySound.value && soundEffects.correct.play()
  const playWrongSound = () => canPlaySound.value && soundEffects.wrong.play()

  const playMain = () => {
    if (!canPlayMusic.value) return
    stopAll()
    backgroundMusic.main.play()
    currentTrack.value = 'main'
    isGameMusicPaused.value = false
  }

  const playGame = () => {
    if (!canPlayMusic.value) return
    stopAll()
    backgroundMusic.game.play()
    currentTrack.value = 'game'
    isGameMusicPaused.value = false
  }

  const pauseGameMusic = () => {
    backgroundMusic.game.pause()
    isGameMusicPaused.value = true
  }

  const resumeGameMusic = () => {
    if (isGameMusicPaused.value && canPlayMusic.value) {
      backgroundMusic.game.play()
      isGameMusicPaused.value = false
    }
  }

  const stopAll = () => {
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
