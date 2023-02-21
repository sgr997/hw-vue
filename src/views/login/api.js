import { request } from '@/utils'

export default {
  login: (data) => request.post('/user/login', data, { noNeedToken: true }),
}
