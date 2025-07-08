import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

interface User {
  name: string
  password: string
  avatar: string | null
}

interface AuthForm {
  name: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const users = useLocalStorage<User[]>('millionaire-users', [])
  const currentUser = useLocalStorage<User>('current-user', {} as User)
  const isLoginMode = ref<boolean>(true)
  const formData = ref<AuthForm>({
    name: '',
    password: '',
  })

  const errorMessage = ref<String>('')
  const successMessage = ref<String>('')
  const avatarFile = ref<string | null>(null)

  const isAuthenticated = computed<boolean>(() => !!currentUser.value?.name)

  const toggleMode = (): void => {
    isLoginMode.value = !isLoginMode.value
    formData.value = { name: '', password: '' }
    errorMessage.value = ''
    successMessage.value = ''
    avatarFile.value = null
  }

  const login = (name: string, password: string): boolean => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!name || !password) {
      errorMessage.value = 'Заполните все поля'
      return false
    }

    const foundUser = users.value.find((user) => user.name === name && user.password === password)

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

    if (!avatarFile.value) {
      errorMessage.value = 'Пожалуйста, загрузите аватар'
      return false
    }

    if (users.value.some((user) => user.name === name)) {
      errorMessage.value = 'Пользователь с таким именем уже существует'
      return false
    }

    const newUser = {
      name,
      password,
      avatar: avatarFile.value,
    }

    users.value.push(newUser)
    currentUser.value = newUser
    successMessage.value = `Регистрация прошла успешно, ${newUser.name}!`
    return true
  }

  const logout = (): void => {
    currentUser.value = {} as User
  }

  const {
    files,
    open: openFileDialog,
    reset: resetFileDialog,
  } = useFileDialog({
    accept: 'image/*',
    multiple: false,
  })

  watch(files, (newFiles) => {
    if (!newFiles) return
    const file = newFiles[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      avatarFile.value = e.target.result as string
    }
    reader.readAsDataURL(file)
    resetFileDialog()
  })

  return {
    users,
    currentUser,
    errorMessage,
    successMessage,
    avatarFile,
    isLoginMode,
    formData,

    isAuthenticated,

    login,
    register,
    logout,
    openFileDialog,
    toggleMode,
  }
})
