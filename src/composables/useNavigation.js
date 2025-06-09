import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/constants/routes'

export function useNavigation() {
  const router = useRouter()

  const navigateToHome = () => {
    router.push(ROUTE_PATHS.HOME)
  }

  const navigateToGame = () => {
    router.push(ROUTE_PATHS.GAME)
  }

  return {
    navigateToHome,
    navigateToGame,
  }
}
