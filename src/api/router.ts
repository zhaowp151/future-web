import request from '@/utils/request'

export function getRouterList (params: any) {
  return request({
    url: '/menu/navigate',
    method: 'get',
    params
  })
}
