import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/sentiments'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: sentiment
    {
      path: '/sentiments',
      name: 'sentiments',
      component: () => import('@/pages/sentimentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sentiments/new',
      name: 'sentimentNew',
      component: () => import('@/pages/sentimentNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sentiments/:id',
      name: 'sentimentEdit',
      component: () => import('@/pages/sentimentEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: ratios
    {
      path: '/ratioss',
      name: 'ratioss',
      component: () => import('@/pages/ratiossListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ratioss/new',
      name: 'ratiosNew',
      component: () => import('@/pages/ratiosNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ratioss/:id',
      name: 'ratiosEdit',
      component: () => import('@/pages/ratiosEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    
    // Consume domain: post
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/pages/postsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id',
      name: 'postView',
      component: () => import('@/pages/postViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: comment
    {
      path: '/comments',
      name: 'comments',
      component: () => import('@/pages/commentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comments/:id',
      name: 'commentView',
      component: () => import('@/pages/commentViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: user
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/usersListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:id',
      name: 'userView',
      component: () => import('@/pages/userViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'sentiments' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Creators Dashboard Login' : 'Classifier'
})

export default router