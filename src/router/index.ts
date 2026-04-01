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
    
    // Control domain: Sentiment
    {
      path: '/sentiments',
      name: 'Sentiments',
      component: () => import('@/pages/SentimentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sentiments/new',
      name: 'SentimentNew',
      component: () => import('@/pages/SentimentNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sentiments/:id',
      name: 'SentimentEdit',
      component: () => import('@/pages/SentimentEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: Ratio
    {
      path: '/ratios',
      name: 'Ratios',
      component: () => import('@/pages/RatiosListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ratios/new',
      name: 'RatioNew',
      component: () => import('@/pages/RatioNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ratios/:id',
      name: 'RatioEdit',
      component: () => import('@/pages/RatioEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    
    // Consume domain: Post
    {
      path: '/posts',
      name: 'Posts',
      component: () => import('@/pages/PostsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id',
      name: 'PostView',
      component: () => import('@/pages/PostViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Comment
    {
      path: '/comments',
      name: 'Comments',
      component: () => import('@/pages/CommentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comments/:id',
      name: 'CommentView',
      component: () => import('@/pages/CommentViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: User
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/pages/UsersListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:id',
      name: 'UserView',
      component: () => import('@/pages/UserViewPage.vue'),
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
    next({ name: 'Sentiments' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Creators Dashboard Login' : 'Classifier'
})

export default router