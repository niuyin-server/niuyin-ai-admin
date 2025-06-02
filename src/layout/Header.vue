<script setup>
const menus = [
  {
    id: 0,
    name: "首页",
    link: "/",
    icon: "House"
  }
]
import {onMounted, ref} from "vue";
import {Sunny, Moon, Picture} from "@element-plus/icons-vue";
import {useDark, useToggle} from "@vueuse/core";

const isDark = useDark();

const toggleDark = useToggle(isDark);

import {useUserStore} from "@/store/userStore.js";

const userStore = useUserStore();

const loadLoginUser = async () => {
  await userStore.getUserInfo()
}

onMounted(() => {
  loadLoginUser()
})
</script>

<template>
  <el-header class="header-container">
    <el-row class="w-full h-full" :gutter="20">
      <el-col :span="4">
        <div class="h-full flex items-center justify-center">
          <img style="width: 24px; height: 24px"
               src="@/assets/logo.png" alt="eoait"/>
        </div>
      </el-col>
      <el-col :span="16">

      </el-col>
      <el-col :span="4">
        <div class="w-full h-full flex justify-start items-center">
          <div class="w-full h-full flex justify-start items-center">
            <img
                :src="userStore.user.avatar"
                alt="avatar" class="shadow-md size-10 rounded-full"/>
            <span class="text-sm flex ml-2 items-center font-semibold"> {{ userStore.user.nickName }} </span>
          </div>
          <el-switch
              v-model="isDark"
              :active-icon="Moon"
              :inactive-icon="Sunny"
              inline-prompt
              @change="toggleDark"
          />
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<style scoped>
.header-container {
  box-shadow: 0 2px 6px -2px rgb(0 0 0 / 0.1), 0 0 4px -2px rgb(0 0 0 / 0.1);
}

.dark .header-container {
  box-shadow: 0 2px 6px -2px rgba(188, 185, 185, 0.1), 0 0 4px -2px rgba(32, 31, 31, 0.1);
}

.router-link {
  text-decoration: none;
  padding: .5rem 1rem;
  border-radius: .75rem;
}

.router-link-exact-active {
  background-color: var(--eoait-bg-primary);
  font-weight: 600;
}
</style>
