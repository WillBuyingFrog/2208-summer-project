import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import axios from 'axios'
import * as ELIcons from '@element-plus/icons-vue'

import GlobalInfo from './GlobalInfo.js'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

// global mounted
app.config.globalProperties.GLOBAL = GlobalInfo

// axios
app.config.globalProperties.$http = axios
axios.defaults.baseURL = GlobalInfo.backUrl;
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}