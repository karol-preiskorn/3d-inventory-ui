import { Injectable, NgModule } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router'

import { CubeComponent } from './components/3d/3d.component'
import { LoginComponent } from './components/auth/login.component'
import { HomeComponent } from './components/home/home.component'
import { AuthGuard } from './guards/auth.guard'
import { ResolverDevice } from './resolverDevice'
import { ResolverModel } from './resolverModel'

@Injectable({
  providedIn: 'root'
})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super()
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState)
    if (title !== undefined) {
      this.title.setTitle(`3d-inventory: ${title}`)
    }
  }
}

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: '3d',
    component: CubeComponent,
    title: '3d',
    resolve: { resolveDeviceList: ResolverDevice, resolveModelList: ResolverModel },
  },

  // Lazy loaded feature modules
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'devices',
    loadChildren: () => import('./features/devices/devices.routes').then((m) => m.DEVICES_ROUTES),
  },
  {
    path: 'models',
    loadChildren: () => import('./features/models/models.routes').then((m) => m.MODELS_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./features/attributes/attributes.routes').then((m) => m.ATTRIBUTES_ROUTES),
  },

  // Legacy routes - keep for backward compatibility
  { path: 'device-list', redirectTo: 'devices', pathMatch: 'full' },
  { path: 'add-device', redirectTo: 'devices/add', pathMatch: 'full' },
  { path: 'edit-device/:id', redirectTo: 'devices/edit/:id', pathMatch: 'full' },
  { path: 'models-list', redirectTo: 'models', pathMatch: 'full' },
  { path: 'add-model', redirectTo: 'models/add', pathMatch: 'full' },
  { path: 'edit-model/:id', redirectTo: 'models/edit/:id', pathMatch: 'full' },

  // Additional lazy-loaded routes
  {
    path: 'connections',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/connection/connection-list/connection-list.component').then(
            (m) => m.ConnectionListComponent,
          ),
        title: 'Connections List',
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./components/connection/add-connection/add-connection.component').then(
            (m) => m.ConnectionAddComponent,
          ),
        title: 'Add Connection',
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/connection/edit-connection/edit-connection.component').then(
            (m) => m.ConnectionEditComponent,
          ),
        title: 'Edit Connection',
      },
    ],
  },
  {
    path: 'floors',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/floors/floor-list/floor-list.component').then((m) => m.FloorListComponent),
        title: 'Floor List',
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./components/floors/add-floor/add-floor.component').then((m) => m.FloorAddComponent),
        title: 'Add Floor',
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/floors/edit-floor/edit-floor.component').then((m) => m.FloorEditComponent),
        title: 'Edit Floor',
      },
    ],
  },

  // Wildcard route - should be last
  { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
