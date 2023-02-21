const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Ql',
  path: '/ql',
  component: Layout,
  meta: {
    title: '青龙管理',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 3,
  },
  children: [
    {
      name: 'Container',
      path: 'container',
      component: () => import('./container/index.vue'),
      meta: {
        title: '面板管理',
        icon: 'fluent:panel-right-28-filled',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'Dict',
      path: 'dict',
      component: () => import('./dict/index.vue'),
      meta: {
        title: '字典管理',
        icon: 'octicon:book',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
  ],
}
