<script setup>
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
  const props = defineProps(['menuData','index'])
  const router = useRouter()
  const store = useStore()
  const handClick = (item,index)=>{
    store.commit('addMenu',item.meta)
    router.push(item.meta.path)
}
  
</script>

<template>
          <template v-for="(item) in props.menuData" :key="`${props.index}-${item.meta.id}`">
            <el-menu-item 
              @click="handClick(item,`${props.index}-${item.meta.id}`)"
              v-if="!item.children || (item.children && item.children.length == 0)" 
              :index="`${props.index}-${item.meta.id}`"
              >
              <el-icon size="20">
                <component :is="item.meta.icon"></component>
              </el-icon>
              <span>{{ item.meta.name }}</span>
            </el-menu-item>

            <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
              <template #title>
                <el-icon size="20">
                <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.name }}</span>
              </template>
              <tree-menu   
                :menu-data="item.children" 
                :index="`${props.index}-${item.meta.id}`">
              </tree-menu>
            </el-sub-menu>
          </template> 
</template>

<style scoped>

</style>
