import request from '@/api/interceptor';

// 查询 API 密钥分页
export async function getApiKeyPage(params) {
    return await request.get('v1/api-key/page', {params})
}

// 获得 API 密钥列表
export async function getApiKeySimpleList() {
    return await request.get('v1/api-key/simple-list')
}

// 查询 API 密钥详情
export async function getApiKey(id) {
    return await request.get('v1/api-key/get?id=' + id)
}

// 新增 API 密钥
export async function createApiKey(data) {
    return await request.post('v1/api-key/create', data)
}

// 修改 API 密钥
export async function updateApiKey(data) {
    return await request.put('v1/api-key/update', data)
}

// 修改 API 密钥
export async function updateApiKeyState(data) {
    return await request.put('v1/api-key/updateState', data)
}

// 删除 API 密钥
export async function deleteApiKey(id) {
    return await request.delete('v1/api-key/delete?id=' + id)
}

// 获得 AI 平台列表
export async function getPlatformList() {
    return await request.get('v1/api-key/platform-list')
}
