import { defineStore } from 'pinia';
import { login } from '@/api/login';

// 定义一个名为 login 的存储模块
export const useLoginStore = defineStore('login', {
  state: () => ({
    token: null,
  }),
  persist: true,
  actions: {
    async login(userInfo) {
      try {
        const response = await login(userInfo);
        this.token = response.data.data;
        localStorage.setItem('token', this.token);
      } catch (error) {
        console.error('登录请求失败:', error);
        throw error;
      }
    },
  },
});
