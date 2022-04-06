import http from '@/utils/request'

export const getRightsList = () => {
  return http.get('rights/list')
}

export const getRightsTree = () => {
  return http.get('rights/tree')
}
