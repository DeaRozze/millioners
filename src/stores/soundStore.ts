import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import { useLocalStorage } from '@vueuse/core'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import gameTheme from '@/assets/sounds/game-theme.mp3'
import correctSound from '@/assets/sounds/correct-answer.mp3'
import wrongSound from '@/assets/sounds/wrong-answer.mp3'
import { ref,watch } from 'vue'

type SoundTrack = 'main' | 'game' | ''

export const useSoundStore = defineStore('sound', () => {
  const volume = useLocalStorage('volume', 0.5)
  const soundEffectsEnabled = useLocalStorage('soundEffectsEnabled', true)
  const backgroundMusicEnabled = useLocalStorage('backgroundMusicEnabled', true)
  const currentTrack = ref<SoundTrack>('')
  const isGameMusicPaused = ref<boolean>(false)

  const soundEffects = {
    correct: useSound(correctSound, { volume: volume.value, interrupt: true }),
    wrong: useSound(wrongSound, { volume: volume.value, interrupt: true }),
  }

  const backgroundMusic = {
    main: useSound(mainTheme, { volume: volume.value, interrupt: true, loop: false }),
    game: useSound(gameTheme, { volume: volume.value, interrupt: true, loop: true }),
  }

  watch(volume, (newVolume) => {
    Object.values(soundEffects).forEach((s) => {
      s.sound.value.volume(newVolume)
    })
    Object.values(backgroundMusic).forEach((s) => {
      s.sound.value.volume(newVolume)
    })
  })

  const playCorrectSound = () => soundEffectsEnabled.value && soundEffects.correct.play()
  const playWrongSound = () => soundEffectsEnabled.value && soundEffects.wrong.play()

  const playMain = () => {
    if (!backgroundMusicEnabled.value) return
    stopAll()
    backgroundMusic.main.play()
    currentTrack.value = 'main'
    isGameMusicPaused.value = false
  }

  const playGame = () => {
    if (!backgroundMusicEnabled.value) return
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
    if (isGameMusicPaused.value && backgroundMusicEnabled.value) {
      backgroundMusic.game.play()
      isGameMusicPaused.value = false
    }
  }

  const stopAll = () => {
    backgroundMusic.main.stop()
    backgroundMusic.game.stop()
    currentTrack.value = ''
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
