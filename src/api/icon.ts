import request from '@/utils/request'

export function getIconList (params: any) {
  return request({
    url: '/icon/getList',
    method: 'get',
    params
  })
}
