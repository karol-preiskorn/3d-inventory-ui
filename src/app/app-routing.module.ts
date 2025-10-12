import { Injectable, NgModule } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router'

import { CubeComponent } from './components/3d/3d.component'
import { AdminLayoutComponent } from './components/admin/admin-layout.component'
import { ActivityLogsComponent } from './components/admin/activity-logs.component'
import { AttributeDictionaryAddComponent } from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component'
import { AttributeDictionaryListComponent } from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component'
import { AttributeDictionaryEditComponent } from './components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component'
import { AttributeAddComponent } from './components/attribute/add-attribute/add-attribute.component'
import { AttributeListComponent } from './components/attribute/attribute-list/attribute-list.component'
import { AttributeEditComponent } from './components/attribute/edit-attribute/edit-attribute.component'
import { LoginComponent } from './components/auth/login.component'
import { ConnectionAddComponent } from './components/connection/add-connection/add-connection.component'
import { ConnectionListComponent } from './components/connection/connection-list/connection-list.component'
import { ConnectionEditComponent } from './components/connection/edit-connection/edit-connection.component'
import { DeviceAddComponent } from './components/devices/add-device/add-device.component'
import { DeviceListComponent } from './components/devices/devices-list/devices-list.component'
import { DeviceTestComponent } from './components/device-test.component'
import { DeviceEditComponent } from './components/devices/edit-device/edit-device.component'
import { LogTestComponent } from './components/log-test/log-test.component'
import { AddFloorComponent } from './components/floors/add-floor/add-floor.component'
import { FloorEditComponent } from './components/floors/edit-floor/edit-floor.component'
import { FloorListComponent } from './components/floors/floor-list/floor-list.component'
import { HomeComponent } from './components/home/home.component'
import { ModelAddComponent } from './components/models/add-model/add-model.component'
import { ModelEditComponent } from './components/models/edit-model/edit-model.component'
import { ModelsListComponent } from './components/models/model-list/model-list.component'
import { UserListComponent } from './components/users/user-list.component'
import { UserFormComponent } from './components/users/user-form.component'
import { UserProfileComponent } from './components/users/user-profile.component'
import { AuthGuard } from './guards/auth.guard'
import { AdminGuard } from './guards/admin.guard'
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

  // Admin routes - protected by AdminGuard for admin-only access
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent, title: 'User Management' },
      { path: 'users/new', component: UserFormComponent, title: 'Add User' },
      { path: 'users/edit/:id', component: UserFormComponent, title: 'Edit User' },
      { path: 'profile', component: UserProfileComponent, title: 'My Profile' },
      { path: 'activity-logs', component: ActivityLogsComponent, title: 'Activity Logs' },
    ]
  },

  // Existing routes
  { path: 'device-test', component: DeviceTestComponent, title: 'Device API Test', canActivate: [AuthGuard] },
  { path: 'log-test', component: LogTestComponent, title: 'Log API Test', canActivate: [AuthGuard] },
  { path: 'device-list', component: DeviceListComponent, title: 'Device List', canActivate: [AuthGuard] },
  { path: 'edit-device/:id', component: DeviceEditComponent, title: 'Edit Device', canActivate: [AuthGuard] },
  { path: 'add-device', component: DeviceAddComponent, title: 'Add Device', canActivate: [AuthGuard] },
  { path: 'models-list', component: ModelsListComponent, title: 'Models List', canActivate: [AuthGuard] },
  { path: 'edit-model/:id', component: ModelEditComponent, title: 'Edit Model', canActivate: [AuthGuard] },
  { path: 'add-model', component: ModelAddComponent, title: 'Add Model', canActivate: [AuthGuard] },
  {
    path: 'attribute-dictionary-list',
    component: AttributeDictionaryListComponent,
    title: 'Attribute Dictionary List',
    canActivate: [AuthGuard],
  },
  { path: 'add-attribute-dictionary', component: AttributeDictionaryAddComponent, title: 'Add Attribute Dictionary', canActivate: [AuthGuard] },
  {
    path: 'edit-attribute-dictionary/:id',
    component: AttributeDictionaryEditComponent,
    title: 'Edit Attribute Dictionary',
    canActivate: [AuthGuard],
  },
  { path: 'attribute-list', component: AttributeListComponent, title: 'Attribute List', canActivate: [AuthGuard] },
  { path: 'add-attribute', component: AttributeAddComponent, title: 'Add Attribute', canActivate: [AuthGuard] },
  { path: 'edit-attribute/:id', component: AttributeEditComponent, title: 'Edit Attribute', canActivate: [AuthGuard] },
  { path: 'connection-list', component: ConnectionListComponent, title: 'Connections List', canActivate: [AuthGuard] },
  { path: 'add-connection', component: ConnectionAddComponent, title: 'Add Connections', canActivate: [AuthGuard] },
  { path: 'edit-connection/:id', component: ConnectionEditComponent, title: 'Edit Connections', canActivate: [AuthGuard] },
  { path: 'floor-list', component: FloorListComponent, title: 'Floor List', canActivate: [AuthGuard] },
  { path: 'add-floor', component: AddFloorComponent, title: 'Add Floor', canActivate: [AuthGuard] },
  { path: 'edit-floor/:id', component: FloorEditComponent, title: 'Edit Floor', canActivate: [AuthGuard] },

  // Wildcard route - should be last
  { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
