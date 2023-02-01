import { createRouter, createWebHistory } from 'vue-router'
import ContentEditableTest from './components/content-editable-test.vue'
import DbTest from './components/db-test.vue'
import Home from './components/home.vue'
import WwTest from './components/ww-test.vue'
import GeolocationTest from './components/geolocation-test.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/db-test', component: DbTest },
  { path: '/ww-test', component: WwTest },
  { path: '/content-editable-test', component: ContentEditableTest },
  { path: '/geolocation-test', component: GeolocationTest }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
