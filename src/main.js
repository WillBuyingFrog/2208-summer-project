import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import * as ELIcons from '@element-plus/icons-vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}	