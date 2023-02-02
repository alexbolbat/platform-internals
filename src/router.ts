import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import BatteryStatus from './components/battery-status.vue'
import ContentEditableTest from './components/content-editable-test.vue'
import DbTest from './components/db-test.vue'
import GeolocationTest from './components/geolocation-test.vue'
import Home from './components/home.vue'
import MessageWindow from './components/message-window.vue'
import PostMessageTest from './components/post-message-test.vue'
import VibrateTest from './components/vibrate-test.vue'
import WwTest from './components/ww-test.vue'
import PageVisibilityTest from './components/page-visibility-test.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/db-test', component: DbTest },
  { path: '/ww-test', component: WwTest },
  { path: '/content-editable-test', component: ContentEditableTest },
  { path: '/geolocation-test', component: GeolocationTest },
  { path: '/post-message-test', component: PostMessageTest },
  { path: '/message-window', component: MessageWindow },
  { path: '/vibrate-test', component: VibrateTest },
  { path: '/battery-status', component: BatteryStatus },
  { path: '/page-visibility-test', component: PageVisibilityTest },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
