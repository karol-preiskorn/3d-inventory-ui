import { Routes } from '@angular/router'
import { AdminGuard } from '../../guards/admin.guard'

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
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
