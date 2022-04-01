import router from '@/router'

router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token')
  if (to.path === '/login') {
    if (token) {
      next(from.path)
      return
    }
    next()
  } else if (to.path !== '/login') {
    if (!token) {
      next('/login')
      return
    }
    next()
  }
})
