import {createApp} from 'vue'
import './style.css'
import "@/styles/element/index.scss";
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhLocale from 'element-plus/es/locale/lang/zh-cn.mjs'

import '@/styles/element/dark.scss'

import "./tailwind.css";

import router from '@/router/index'

import JsonViewer from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus, {locale: zhLocale})
app.use(router)
app.use(JsonViewer)
app.use(pinia) // pinia
app.mount('#app')
