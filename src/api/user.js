import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth2/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/oauth2/user/profile',
    method: 'get'
  })
}

export function logout(accessToken) {
  return request({
    url: '/oauth2/oauth/token/revoke',
    method: 'delete',
    params: { 
      'token': accessToken,
      'token_type': 'accessToken' 
    }
  })
}