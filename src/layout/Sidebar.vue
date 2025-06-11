<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

import {
  House,
  Monitor,
  Location,
  Setting,
  Key, MagicStick, ChromeFilled, User
} from '@element-plus/icons-vue'

// 动态菜单配置
const menuData = ref([
  {
    index: '/',
    title: '首页',
    icon: House
  },
  {
    index: '/dashboard',
    title: '工作台',
    icon: Monitor
  },
  {
    index: '/model',
    title: '模型管理',
    icon: Location,
    children: [
      {index: '/model/key', title: 'AI密钥', icon: Key},
      {index: '/model/model', title: 'AI模型', icon: ChromeFilled},
      {index: '/model/role', title: 'AI角色', icon: User},
      {index: '/model/tool', title: 'AI工具', icon: MagicStick}
    ]
  },
  {
    index: '/login',
    title: '登录',
    icon: Setting
  }
]);
const isCollapse = ref(false)
// 激活index绑定当前路由
// activeIndex.value = router.currentRoute.value.path
const activeIndex = ref(router.currentRoute.value.path)
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
  // 跳转到页面
  router.push(key)
}

</script>

<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @select="handleSelect"
  >
    <template v-for="item in menuData" :key="item.index">
      <!-- 普通菜单项 -->
      <el-menu-item
          v-if="!item.children"
          :index="item.index"
      >
        <el-icon>
          <component :is="item.icon"/>
        </el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>

      <!-- 子菜单 -->
      <el-sub-menu v-else :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"/>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
            v-for="child in item.children"
            :key="child.index"
            :index="child.index"
        >
          <el-icon>
            <component :is="child.icon"/>
          </el-icon>
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
