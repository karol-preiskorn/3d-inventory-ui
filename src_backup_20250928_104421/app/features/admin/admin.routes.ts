import { Routes } from '@angular/router'

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadComponent: () => import('../../components/users/user-list.component').then(m => m.UserListComponent),
        title: 'User Management'
      },
      {
        path: 'users/new',
        loadComponent: () => import('../../components/users/user-form.component').then(m => m.UserFormComponent),
        title: 'Add User'
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('../../components/users/user-form.component').then(m => m.UserFormComponent),
        title: 'Edit User'
      }
    ]
  }
]
