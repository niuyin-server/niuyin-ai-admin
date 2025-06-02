<script setup>
import Header from './Header.vue'
import Main from './Main.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div class="common-layout h-full w-full">
    <el-container class="h-full w-full" :direction="'vertical'">
      <Header/>
      <Main/>
<!--      <Footer/>-->
    </el-container>
  </div>
</template>

<style scoped>

</style>
