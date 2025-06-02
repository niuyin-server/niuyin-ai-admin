<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
import { useLoginStore } from '@/store/login';

const loginStore = useLoginStore();
const username = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        await loginStore.login({ username: username.value, password: password.value });
        // 登录成功后的跳转逻辑 
        router.push('/');
    } catch (error) {
        console.error('登录失败:', error);
    }
};
</script>

<template>
    <div class="login-container">
        <h2>登录</h2>
        <input v-model="username" type="text" placeholder="用户名" />
        <input v-model="password" type="password" placeholder="密码" />
        <button @click="handleLogin">登录</button>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 300px;
    margin: 50px auto;
}

input,
button {
    width: 100%;
    padding: 0.5rem;
}
</style>
