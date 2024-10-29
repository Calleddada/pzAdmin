
const localData = localStorage.getItem('peizhen')
//判断本地是否有peizhen数据,否则使用默认数据
const state = localData ? localData.menu : {
    isCollapse: false,
    selectMenu: [],
    routerList: [],
    menuActive: '1-1'
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload) {
        //对数据去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload) {
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(val => val.path === payload.path)
        //通过索引删除数据指定元素
        state.selectMenu.splice(index, 1)
    },
    //动态
    dynamicMenu(state, payload) {
        //通过glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue')
        console.log(modules)
        function routerSet(router) {
            router.forEach(route => {
                //判断是否有children子菜单，拼接路由数据
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`
                    //拿到获取的vue组件
                    route.component = modules[url]
                } else {
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList = payload
    },
    //更新当前激活菜单
    updateMenuActive(state, payload) {
        state.menuActive = payload
    }
}
export default {
    state,
    mutations
}