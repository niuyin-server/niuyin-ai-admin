import request from '@/api/interceptor';

export async function login(data) {
    return await request.post('v1/manager/login',data)
}
