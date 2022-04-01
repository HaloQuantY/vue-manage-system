import http from '@/utils/request'

function loginRequest (username, password) {
  return http.post('/login', {
    username,
    password
  })
}

export {
  loginRequest
}
