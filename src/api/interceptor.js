import axios from 'axios'
import {ElMessage, ElMessageBox} from "element-plus";
import {useLoginStore} from '@/store/login';
import JSONBIG from 'json-bigint'

// if (import.meta.env.VITE_API_BASE_URL) {
//     axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
//     axios.defaults.timeout = 20000
// }
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000 // request timeout
})

instance.defaults.transformResponse = [
    function (data) {
        const json = JSONBIG({
            storeAsString: true
        })
        const res = json.parse(data)
        return res
    }
]

// 添加请求拦截器
instance.interceptors.request.use(config => {
    const loginStore = useLoginStore();
    if (loginStore.token) {
        config.headers['Authorization'] = `Bearer ${loginStore.token}`;
    }
    return config
}, error => {
    return Promise.reject(error);
});

let loginDialog = true

// 添加响应拦截器
instance.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code
    // 获取错误信息
    const msg = res.data.msg
    // 二进制数据则直接返回
    // if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    //     return res.data
    // }
    // 未认证
    if (code === 401) {
        // 展示重新登陆逻辑
        if (loginDialog) {
            loginDialog = false
            ElMessageBox.confirm('登录状态已过期，是否选择重新登录', '提示', {
                confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning'
            }).then(() => {
                location.href = '/login';
            }).catch(() => {
                loginDialog = true
            });
            return Promise.reject('请重新登录。')
        }
    } else if (code === 500) {
        ElMessage.error(msg)
        return Promise.reject(new Error("系统错误"))
    } else if (code !== 200) {
        ElMessage.error(msg)
        return Promise.reject('error')
    } else {
        return res
    }
}, function (error) {
    return Promise.reject(error)
});

export default instance;
