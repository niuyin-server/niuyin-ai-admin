import request from '@/api/interceptor';

export async function getUserInfo() {
    return await request.get('v1/manager/userInfo')
}
