import request from '@/api/interceptor';

// 查询 AI 模型分页
export async function getModelPage(params) {
    return await request.get('v1/model/page', {params})
}

// 获得 AI 模型列表
export async function getModelSimpleList() {
    return await request.get('v1/model/simple-list')
}

// 查询 AI 模型详情
export async function getModel(id) {
    return await request.get('v1/model/get?id=' + id)
}

// 新增 AI 模型
export async function createModel(data) {
    return await request.post('v1/model/create', data)
}

// 修改 AI 模型
export async function updateModel(data) {
    return await request.put('v1/model/update', data)
}

// 修改 AI 模型
export async function updateModelState(data) {
    return await request.put('v1/model/updateState', data)
}

// 删除 AI 模型
export async function deleteModel(id) {
    return await request.delete('v1/model/delete?id=' + id)
}

// 获得 AI 模型类型列表
export async function getModelTypeList() {
    return await request.get('v1/model/type-list')
}
