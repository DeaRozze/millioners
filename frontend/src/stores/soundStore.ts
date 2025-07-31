import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import { useLocalStorage } from '@vueuse/core'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import gameTheme from '@/assets/sounds/game-theme.mp3'
import resultTheme from '@/assets/sounds/result-theme.mp3'
import correctSound from '@/assets/sounds/correct-answer.mp3'
import wrongSound from '@/assets/sounds/wrong-answer.mp3'
import { ref, watch } from 'vue'

type SoundTrack = 'main' | 'game' | 'result' | ''

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
    result: useSound(resultTheme, { volume: volume.value, interrupt: true, loop: false }),
  }

  watch(volume, (newVolume) => {
    const allSounds = [...Object.values(soundEffects), ...Object.values(backgroundMusic)]
    allSounds.forEach((s) => {
      s.sound.value.volume(newVolume)
    })
  })

  const playCorrectSound = () => soundEffectsEnabled.value && soundEffects.correct.play()
  const playWrongSound = () => soundEffectsEnabled.value && soundEffects.wrong.play()

  const playTrack = (track: 'main' | 'game' | 'result') => {
    if (!backgroundMusicEnabled.value) return
    stopAll()
    if (backgroundMusic[track]) {
      backgroundMusic[track].play()
      currentTrack.value = track
      isGameMusicPaused.value = false
    }
  }

  const playMain = () => playTrack('main')
  const playGame = () => playTrack('game')
  const playResult = () => playTrack('result')

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
    playResult,
    pauseGameMusic,
    resumeGameMusic,
    playCorrectSound,
    playWrongSound,
    stopAll,
  }
})
