<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const menusTopList = [
  {id: 0, name: "首页", class: "#icon-index", link: "/"},
  {id: 1, name: "推荐", class: "#icon-discover", link: "/discover"},
  {id: 2, name: "热门", class: "#icon-hotVideo", link: "/hotVideo"},
  {id: 3, name: "登录", class: "#icon-hotVideo", link: "/login"},
]
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

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
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse"
             @select="handleSelect">
      <el-menu-item index="/">
        <el-icon>
          <setting/>
        </el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="/dashboard">
        <el-icon>
          <setting/>
        </el-icon>
        <template #title>工作台</template>
      </el-menu-item>
      <el-sub-menu index="/model">
        <template #title>
          <el-icon>
            <location/>
          </el-icon>
          <span>模型管理</span>
        </template>
        <el-menu-item index="/model/key">AI密钥</el-menu-item>
        <el-menu-item index="/model/model">AI模型</el-menu-item>
        <el-menu-item index="/model/role">AI角色</el-menu-item>
        <el-menu-item index="/model/tool">AI工具</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/login">
        <el-icon>
          <setting/>
        </el-icon>
        <template #title>登录</template>
      </el-menu-item>
    </el-menu>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">e</el-radio-button>
      <el-radio-button :value="true">c</el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
