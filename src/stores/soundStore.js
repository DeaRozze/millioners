import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import gameTheme from '@/assets/sounds/game-theme.mp3'
import { ref } from 'vue'

export const useSoundStore = defineStore('sound', () => {
  const volume = ref(0.5)
  const isMuted = ref(false)
  const currentTrack = ref(null)

  const { play: playMainTheme, stop: stopMainTheme } = useSound(mainTheme, {
    volume,
    interrupt: true,
    loop: false,
  })

  const { play: playGameTheme, stop: stopGameTheme } = useSound(gameTheme, {
    volume,
    interrupt: true,
    loop: true,
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
  }

  const stopAll = () => {
    stopMainTheme()
    stopGameTheme()
    currentTrack.value = null
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
    playMain,
    playGame,
    stopAll,
    toggleMute,
  }
})
