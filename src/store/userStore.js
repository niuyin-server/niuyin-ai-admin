import {defineStore} from 'pinia';
import {getUserInfo} from '@/api/user';

// 定义一个名为 user 的存储模块
export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            userName: null,
            nickName: null,
            avatar: null,
        },
    }),
    persist: true,
    actions: {
        async getUserInfo() {
            try {
                const response = await getUserInfo();
                // 转为json字符串
                this.user = response.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
            } catch (error) {
                console.error('请求失败:', error);
                throw error;
            }
        },
    },
});
