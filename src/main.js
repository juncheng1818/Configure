import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import {createPinia} from 'pinia'
const state = createPinia()
app.use(state)

app.mount('#app')
