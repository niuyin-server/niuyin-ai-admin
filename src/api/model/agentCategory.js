import request from '@/api/interceptor';

// 查询AgentCategory分页
export async function getModelAgentCategoryPage(params) {
    return await request.get('v1/agentCategory/page', {params})
}

// 获得AgentCategory列表
export async function getModelAgentCategorySimpleList() {
    return await request.get('v1/agentCategory/simple-list')
}

// 查询AgentCategory详情
export async function getModelAgentCategory(id) {
    return await request.get('v1/agentCategory/get?id=' + id)
}

// 新增AgentCategory
export async function createModelAgentCategory(data) {
    return await request.post('v1/agentCategory/create', data)
}

// 修改AgentCategory
export async function updateModelAgentCategory(data) {
    return await request.put('v1/agentCategory/update', data)
}

// 删除AgentCategory
export async function deleteModelAgentCategory(id) {
    return await request.delete('v1/agentCategory/delete?id=' + id)
}
