import { createApp } from 'vue'

// import 'babel/polyfill'
// import Es6Promise from 'es6-promise'
// require('es6-promise').polyfill()
// Es6Promise.polyfill()

import App from './App.vue'
// import router from './router'
// import store from './store'

// import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
// import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App)
// app.use(ElementPlus, { locale })
// app.use(store)
// app.use(router)
app.mount('#app')
