import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
//全局导入PanelHead组件
import PanelHead from './components/panelHead.vue'

//刷新后的动态路由添加
// const localData = localStorage.getItem('peizhen')
// if (localData) {
//   //动态路由添加
//   store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
//   //遍历路由列表，动态添加路由
//   store.state.menu.routerList.forEach(item => {
//     router.addRoute('main', item)
//   })
// }

//路由拦截
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  //非登录页面token不存在
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
})




const app = createApp(App)
// 全局注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//全局注册PanelHeader组件
app.component('PanelHead', PanelHead)
//路由挂载
app.use(router)
//store挂载
app.use(store)
app.mount('#app')

