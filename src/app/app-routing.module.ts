import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CubeComponent } from './cube/cube.component'
import { ModelComponent } from './model/model.component'
import { HomeComponent } from './home/home.component'
import { DevicesListComponent } from './components/devices-list/devices-list.component'
import { EditDeviceComponent } from './components/edit-device/edit-device.component'
import { AddDeviceComponent } from './components/add-device/add-device.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'cube',
    component: CubeComponent,
  },
  {
    path: 'model',
    component: ModelComponent,
  },
  {
    path: 'devices-list',
    component: DevicesListComponent,
  },
  {
    path: 'edit-device/:id',
    component: EditDeviceComponent,
  },
  {
    path: 'add-device',
    component: AddDeviceComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
