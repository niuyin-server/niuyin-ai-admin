import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url'
import {viteMockServe} from "vite-plugin-mock";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // mock 数据的 dev环境
        viteMockServe({
            // supportTs: true, // 是否开启支持ts
            mockPath: 'mock', // 设置mockPath为根目录下的mock目录
            localEnabled: true, // 设置是否监视mockPath对应的文件夹内文件中的更改
            prodEnabled: false, // 设置是否启用生产环境的mock服务
            watchFiles: true, // 是否监视文件更改
            logger: true  //是否在控制台显示请求日志
        }),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
