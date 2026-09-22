import { createApp } from 'vue'
import './styles/tokens.css'
import './styles/global.css'
import './index.css'
import App from './App.vue'

import { initializeTheme } from '@/composables/useTheme'
import { initializeLanguage } from '@/i18n/useLanguage'

initializeTheme()
initializeLanguage()

createApp(App).mount('#app')
