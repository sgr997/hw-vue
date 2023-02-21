import { request } from '@/utils'

export default {
  getUser: () => request.get('/user/info'),
  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),
}
