import { createApp } from 'vue'
import App from './App.vue'

import VueKonva from 'vue-konva';

const app = createApp(App)

import {createPinia} from 'pinia'
const state = createPinia()
app.use(state)
app.use(VueKonva);
app.mount('#app')
