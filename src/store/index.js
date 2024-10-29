import { createStore } from 'vuex'
import menu from './menu'
//引入插件，将 Vuex 状态持久化到浏览器的存储中
import createPersistedstate from 'vuex-persistedstate'


export default createStore({
    //createPersistedstate相关配置
    plugins: [new createPersistedstate({
        key: 'peizhen',//pz_v3pz  存储在浏览器的key值
    })],

    modules: {
        menu
    }
})