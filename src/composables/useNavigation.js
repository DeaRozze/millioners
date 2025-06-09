import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const navigateToHome = () => {
    router.push('/')
  }

  const navigateToGame = () => {
    router.push('/game')
  }

  return {
    navigateToHome,
    navigateToGame,
  }
}
