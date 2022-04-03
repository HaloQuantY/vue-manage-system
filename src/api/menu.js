import http from '@/utils/request'

export function getMenuList () {
  return http.get('menus')
}
