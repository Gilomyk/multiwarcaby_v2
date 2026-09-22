import { computed, ref } from 'vue'

import { messages, type Language } from './messages'

const STORAGE_KEY = 'multiwarcaby-language'

const storedLanguage = localStorage.getItem(STORAGE_KEY) as Language | null

export const language = ref<Language>(storedLanguage ?? 'pl')

export const t = computed(() => messages[language.value])

export function setLanguage(value: Language) {
  language.value = value
  localStorage.setItem(STORAGE_KEY, value)

  document.documentElement.lang = value
}

export function initializeLanguage() {
  document.documentElement.lang = language.value
}
