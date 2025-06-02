import request from '@/api/interceptor';

// 查询角色分页
export async function getModelRolePage(params) {
    return await request.get('v1/role/page', {params})
}

// 获得角色列表
export async function getModelRoleSimpleList() {
    return await request.get('v1/role/simple-list')
}

// 查询角色详情
export async function getModelRole(id) {
    return await request.get('v1/role/get?id=' + id)
}

// 新增角色
export async function createModelRole(data) {
    return await request.post('v1/role/create', data)
}

// 修改角色
export async function updateModelRole(data) {
    return await request.put('v1/role/update', data)
}

// 修改角色
export async function updateModelRoleState(data) {
    return await request.put('v1/role/updateState', data)
}

// 删除角色
export async function deleteModelRole(id) {
    return await request.delete('v1/role/delete?id=' + id)
}
