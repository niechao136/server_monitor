import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import '@/scss/index.scss'
import '@/SRPFramework/stores'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

export const options = {
  pinia
}
