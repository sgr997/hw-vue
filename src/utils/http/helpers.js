import { useUserStore } from '@/store'

export function addBaseParams(params) {
  if (!params.userId) {
    params.userId = useUserStore().userId
  }
}

export function resolveResError(code, message) {
  switch (code) {
    case 100:
      message = message ?? '请求参数错误'
      break
    case 101:
      message = message ?? '数据不存在'
      break
    case 200:
      message = message ?? '登录已过期'
      useUserStore().logout()
      break
    case 300:
    case 400:
    case 500:
      message = message ?? '服务器异常'
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  return message
}
