import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/oauth2/oauth/client',
    method: 'get',
    params: query
  })
}

export function createClient(data) {
  return request({
    url: '/oauth2/oauth/client',
    method: 'post',
    data
  })
}

export function updateClient(data) {
  return request({
    url: '/oauth2/oauth/client/' + data.client_id,
    method: 'put',
    data
  })
}

export function patchClient(data) {
  return request({
    url: '/oauth2/oauth/client/' + data.client_id + "?client_secret=" + data.client_secret,
    method: 'patch'
  })
}

export function deleteClient(data) {
  return request({
    url: '/oauth2/oauth/client/' + data.client_id,
    method: 'delete'
  })
}
