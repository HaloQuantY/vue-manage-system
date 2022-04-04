import http from '@/utils/request'

export const getUserList = (params) => {
  return http.get('users', { params })
}

export const changeUserStatus = (id, status) => {
  return http.put(`users/${id}/state/${status}`)
}

export const addNewUser = (userInfoObj) => {
  return http.post('users', userInfoObj)
}

export const getUserInfo = (id) => {
  return http.get(`users/${id}`)
}

export const editUser = (userInfo) => {
  const { id, email, mobile } = userInfo
  return http.put(`users/${id}`, { id, email, mobile })
}

export const deleteUser = (id) => {
  return http.delete(`users/${id}`, { id })
}
