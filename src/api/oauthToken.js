import request from '@/utils/request'

export function fetchTokenByClient(query) {
  return request({
    url: '/oauth2/oauth/token/' + query.client_id,
    method: 'get'
  })
}

export function revokeToken(data) {
  return request({
    url: '/oauth2/oauth/token/revoke?token_type=accessToken&token=' + data.access_token,
    method: 'delete'
  })
}
