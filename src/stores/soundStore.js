import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import mainTheme from '@/assets/sounds/main-theme.mp3'
import { ref } from 'vue'

export const useSoundStore = defineStore('sound', () => {
  const volume = ref(0.5)
  const isMuted = ref(false)
  const currentTrack = ref(null)

  const { play: playMainTheme, stop: stopMainTheme } = useSound(mainTheme, {
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

  const stopAll = () => {
    stopMainTheme()
    currentTrack.value = null
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      stopAll()
    } else {
      if (currentTrack.value === 'mainTheme') playMain()
    }
  }

  return {
    volume,
    isMuted,
    currentTrack,
    playMain, 
    stopAll,
    toggleMute,
  }
})
