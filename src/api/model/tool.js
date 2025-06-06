import request from '@/api/interceptor';

// 查询 AI Tool分页
export async function getToolPage(params) {
    return await request.get('v1/tool/page', {params})
}

// 获得 AI Tool列表
export async function getToolSimpleList() {
    return await request.get('v1/tool/simple-list')
}

// 查询 AI Tool详情
export async function getTool(id) {
    return await request.get('v1/tool/get?id=' + id)
}

// 新增 AI Tool
export async function createTool(data) {
    return await request.post('v1/tool/create', data)
}

// 修改 AI Tool
export async function updateTool(data) {
    return await request.put('v1/tool/update', data)
}

// 修改 AI Tool
export async function updateToolState(data) {
    return await request.put('v1/tool/updateState', data)
}

// 删除 AI Tool
export async function deleteTool(id) {
    return await request.delete('v1/tool/delete?id=' + id)
}
