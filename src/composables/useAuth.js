import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { errorMessages } from 'vue/compiler-sfc'

export function useAuth() {
  const usersStorage = useLocalStorage('millionaire-users', [])
  const currentUser = useLocalStorage('current-user', {})
  const errorMessage = ref('')
  const successMessage = ref('')
  const avatarUrl = ref('')

  const login = (name, password) => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!name || !password) {
      errorMessage.value = 'Заполните все поля'
      return false
    }

    const foundUser = usersStorage.value.find(
      (user) => user.name === name && user.password === password,
    )

    if (!foundUser) {
      errorMessage.value = 'Неверное имя пользователя или пароль'
      return false
    }

    currentUser.value = foundUser
    successMessage.value = `Добро пожаловать, ${foundUser.name}!`
    return true
  }

  const register = (name, password) => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!name || !password) {
      errorMessage.value = 'Заполните все поля'
      return false
    }

    if (avatarUrl.value && !avatarUrl.value.startsWith('http')) {
      errorMessage.value = 'Укажите корректный URL (начинается с http/https)'
      return false
    }
    if (usersStorage.value.some((user) => user.name === name)) {
      errorMessages.value = 'Пользователь с таким именем уже существует'
      return false
    }
    const newUser = {
      name,
      password,
      avatar: avatarUrl.value || '/default-avatar.png',
    }
    usersStorage.value = [...usersStorage.value, newUser]
    currentUser.value = newUser
    successMessage.value = `Регистрация прошла успешно, ${newUser.name}!`
    return true
  }
  const logout = () => {
    currentUser.value = {}
  }
  const signalAvatarError = () => {
    errorMessage.value = 'Не удалось загрузить изображение по указанному URL'
    avatarUrl.value = ''
  }
  return {
    usersStorage,
    currentUser,
    errorMessage,
    successMessage,
    avatarUrl,
    login,
    register,
    logout,
    signalAvatarError,
  }
}
