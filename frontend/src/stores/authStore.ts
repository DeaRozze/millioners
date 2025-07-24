import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

interface User {
  name: string
  password: string
  avatar: string | ''
}

interface AuthForm {
  name: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = useLocalStorage<User>('current-user', {} as User)
  const isLoginMode = ref<boolean>(true)
  const formData = ref<AuthForm>({
    name: '',
    password: '',
  })
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  const errorMessage = ref<string>('')
  const successMessage = ref<string>('')
  const avatarFile = ref<User['avatar']>('')

  const isAuthenticated = computed<boolean>(() => !!currentUser.value?.name)

  const resetAuthForm = (): void => {
    formData.value = { name: '', password: '' }
    errorMessage.value = ''
    successMessage.value = ''
    avatarFile.value = ''
  }

  const login = async (name: string, password: string): Promise<boolean> => {
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        errorMessage.value = errorData.error || 'Login failed'
        return false
      }

      const { token, username, avatar } = await response.json()
      localStorage.setItem('token', token)

      currentUser.value = {
        name: username,
        password: '',
        avatar: avatar || '',
      }

      successMessage.value = `Welcome back, ${username}!`
      return true
    } catch (error) {
      errorMessage.value = 'Network error'
      return false
    }
  }

  const register = async (name: string, password: string): Promise<boolean> => {
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          password,
          avatar: avatarFile.value,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        errorMessage.value = errorData.error || 'Registration failed'
        return false
      }

      const { token, username } = await response.json()
      localStorage.setItem('token', token)

      currentUser.value = {
        name: username,
        password: '',
        avatar: avatarFile.value || '',
      }

      successMessage.value = `Registration successful, ${name}!`
      return true
    } catch (error) {
      errorMessage.value = 'Network error'
      return false
    }
  }

  const logout = (): void => {
    localStorage.removeItem('token')
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
      if (e.target?.result) {
        avatarFile.value = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
    resetFileDialog()
  })

  return {
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
    resetAuthForm,
  }
})
