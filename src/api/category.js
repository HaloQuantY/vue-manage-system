import http from '@/utils/request'

export const getCategoryList = (params) => {
  return http.get('categories', { params })
}

export const addNewCategory = (pid, name, level) => {
  return http.post('categories', { cat_pid: pid, cat_name: name, cat_level: level })
}

export const getParentCategoryList = () => {
  return http.get('categories', { params: { type: 2 } })
}

export const editCategory = (id, name) => {
  return http.put(`categories/${id}`, { cat_name: name })
}

export const deleteCategory = (id) => {
  return http.delete(`categories/${id}`)
}
