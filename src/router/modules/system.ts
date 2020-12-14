export default [
  {
    path: '/account',
    name: '账号管理',
    component: () => import(/* webpackChunkName: "page" */ '@/layout/container.vue'),
    children: [{
      path: 'admin',
      name: '管理员账号',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/admin/SystemAccount.vue')
    },
    {
      path: 'admin/edit',
      name: '编辑管理员',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/admin/addOrEditAdmin.vue')
    },
    {
      path: 'role',
      name: '角色管理',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/role/RoleManage.vue')
    },
    {
      path: 'user',
      name: '用户管理',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/user/UserManage.vue')
    },
    {
      path: 'role/editRole/new',
      name: '新增角色',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/role/AddOrEditRole.vue')
    },
    {
      path: 'role/editRole/edit',
      name: '编辑角色',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/role/AddOrEditRole.vue')
    },
    {
      path: 'user/edit',
      name: '编辑用户',
      component: () => import(/* webpackChunkName: "user" */ '@/views/accountManage/user/AddOrEditUser.vue')
    }
    ]
  }
]
