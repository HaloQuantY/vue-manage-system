import http from '@/utils/request'

export const getRolesList = () => {
  return http.get('roles')
}

export const addNewRole = (newRoleInfo) => {
  return http.post('roles', newRoleInfo)
}

export const getRoleInfo = (roleId) => {
  return http.get(`roles/${roleId}`)
}

export const editRole = (roleId, roleName, roleDesc) => {
  return http.put(`roles/${roleId}`, { roleName, roleDesc })
}

export const deleteRole = (roleId) => {
  return http.delete(`roles/${roleId}`)
}

export const deleteRight = (roleId, rightId) => {
  return http.delete(`roles/${roleId}/rights/${rightId}`)
}

export const dispatchRight = (roleId, rightIdStr) => {
  return http.post(`roles/${roleId}/rights`, { rids: rightIdStr })
}
