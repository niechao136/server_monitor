import { Vue } from 'vue-property-decorator'
import VueRouter, { RouteConfig, RawLocation } from 'vue-router'
import { setLayoutBg, setTitle } from '@/SRPFramework/stores'


// 此VueRouter是自己自定義引入暴露出來的，即是自定義的，以下的VueRouter同樣是這樣
// 解決兩次訪問相同路由地址報錯
const original_push = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: RawLocation) {
  return original_push.call(this, location).catch((err: any) => err)
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: async () => await import(/* webpackChunkName: "chunk_overview" */ '@/pages/login/login.vue'),
    meta: { title: 'Router_/login' },
  },
  {
    path: '/',
    component: async () => await import(/* webpackChunkName: "chunk_layout" */ '@/layouts/Layout.vue'),
    children: [
      {
        path: '/overview',
        name: 'overview',
        component: async () => await import(/* webpackChunkName: "chunk_overview" */ '@/pages/overview/overview.vue'),
        meta: { title: 'Router_/' },
      },
      {
        path: '/user',
        name: 'user',
        component: async () => await import(/* webpackChunkName: "chunk_user" */ '@/pages/user/user.vue'),
        meta: { title: 'Router_/user' },
      },
      {
        path: '/key',
        name: 'key',
        component: async () => await import(/* webpackChunkName: "chunk_key" */ '@/pages/key/key.vue'),
        meta: { title: 'Router_/key' },
      },
    ],
  },
  {
    path: '*',
    redirect: { name: 'overview' },
  },
]

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.afterEach((to) => {
  window.document.title = Vue.prototype.$i18n[to.meta.title] ?? 'WISE-iService'
  const title = []
  if (to.meta.sub) {
    title.push(Vue.prototype.$i18n[to.meta.sub])
  }
  title.push(Vue.prototype.$i18n[to.meta.title])
  setTitle(title)
  setLayoutBg('#F0F2F5')
})

export default router
