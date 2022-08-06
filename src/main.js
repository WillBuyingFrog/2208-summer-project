import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import axios from 'axios'
import * as ELIcons from '@element-plus/icons-vue'
import GlobalInfo from './GlobalInfo.js'


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faBold } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faBold)


const app = createApp(App)
app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

// global mounted
app.config.globalProperties.GLOBAL = GlobalInfo

// axios
app.config.globalProperties.$axios = axios
app.config.globalProperties.$http = axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = GlobalInfo.backUrl;
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8;'
axios.defaults.withCredentials=true;

for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}
