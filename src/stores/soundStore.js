import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import gameTheme from '@/assets/sounds/game-theme.mp3'
import correctSound from '@/assets/sounds/correct-answer.mp3'
import wrongSound from '@/assets/sounds/wrong-answer.mp3'
import { ref } from 'vue'

export const useSoundStore = defineStore('sound', () => {
  const volume = ref(0.5)
  const isMuted = ref(false)
  const currentTrack = ref(null)
  const isGameMusicPaused = ref(false) 

  const { play: playMainTheme, stop: stopMainTheme } = useSound(mainTheme, {
    volume,
    interrupt: true,
    loop: true,
  })

  const {
    play: playGameTheme,
    stop: stopGameTheme,
    pause: pauseGameTheme,
  } = useSound(gameTheme, {
    volume,
    interrupt: true,
    loop: true,
  })

  const { play: playCorrectSound } = useSound(correctSound, {
    volume,
    interrupt: true,
  })

  const { play: playWrongSound } = useSound(wrongSound, {
    volume,
    interrupt: true,
  })

  const playMain = () => {
    if (isMuted.value) return
    stopAll()
    playMainTheme()
    currentTrack.value = 'mainTheme'
  }

  const playGame = () => {
    if (isMuted.value) return
    stopAll()
    playGameTheme()
    currentTrack.value = 'gameTheme'
    isGameMusicPaused.value = false
  }

  const pauseGameMusic = () => {
    pauseGameTheme()
    isGameMusicPaused.value = true
  }

  const resumeGameMusic = () => {
    if (isGameMusicPaused.value && !isMuted.value) {
      playGameTheme()
      isGameMusicPaused.value = false
    }
  }

  const stopAll = () => {
    stopMainTheme()
    stopGameTheme()
    currentTrack.value = null
    isGameMusicPaused.value = false
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      stopAll()
    } else {
      if (currentTrack.value === 'mainTheme') playMain()
      else if (currentTrack.value === 'gameTheme') playGame()
    }
  }

  return {
    volume,
    isMuted,
    currentTrack,
    isGameMusicPaused,
    playMain,
    playGame,
    pauseGameMusic,
    resumeGameMusic,
    playCorrectSound,
    playWrongSound,
    stopAll,
    toggleMute,
  }
})
