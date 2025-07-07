import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const users = useLocalStorage('millionaire-users', [])
  const currentUser = useLocalStorage('current-user', {})

  const errorMessage = ref('')
  const successMessage = ref('')
  const avatarFile = ref(null)

  const isAuthenticated = computed(() => !!currentUser.value?.name)

  const login = (name, password) => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!name || !password) {
      errorMessage.value = 'Заполните все поля'
      return false
    }

    const foundUser = users.value.find((user) => user.name === name && user.password === password)

    if (!foundUser) {
      errorMessage.value = 'Пользователь еще не авторизован'
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
  const logout = () => {
    currentUser.value = {}
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
      avatarFile.value = e.target.result
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

    isAuthenticated,

    login,
    register,
    logout,
    openFileDialog,
  }
})
