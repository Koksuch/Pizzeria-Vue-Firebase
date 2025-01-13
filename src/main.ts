import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi, aliases } from 'vuetify/iconsets/mdi-svg'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification'
import { createPinia } from 'pinia'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(ToastPlugin)
app.use(router)

app.mount('#app')
