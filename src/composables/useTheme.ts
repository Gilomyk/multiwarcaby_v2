import { ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'multiwarcaby-theme'

const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null

export const theme = ref<Theme>(storedTheme ?? 'system')

function resolveTheme(value: Theme): 'light' | 'dark' {
  if (value !== 'system') {
    return value
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme() {
  document.documentElement.dataset.theme = resolveTheme(theme.value)
}

export function setTheme(value: Theme) {
  theme.value = value
  localStorage.setItem(STORAGE_KEY, value)
  applyTheme()
}

export function initializeTheme() {
  applyTheme()

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme()
    }
  })
}
