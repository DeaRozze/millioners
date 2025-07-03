import { ref } from 'vue'

export function useAuthForm() {
  const isLoginMode = ref(true)
  const formData = ref({
    name: '',
    password: '',
  })

  const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    formData.value = { name: '', password: '' }
  }

  return {
    isLoginMode,
    formData,
    toggleMode,
  }
}
