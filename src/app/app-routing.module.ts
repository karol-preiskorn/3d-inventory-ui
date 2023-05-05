import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CubeComponent } from 'src/app/components/cube/cube.component'
import { HomeComponent } from 'src/app/components/home/home.component'
import { DevicesListComponent } from 'src/app/components/devices/devices-list/devices-list.component'
import { EditDeviceComponent } from 'src/app/components/devices/edit-device/edit-device.component'
import { AddDeviceComponent } from 'src/app/components/devices/add-device/add-device.component'
import { ModelsListComponent } from './components/models/models-list/models-list.component'
import { AddModelComponent } from './components/models/add-model/add-model.component'
import { EditModelComponent } from './components/models/edit-model/edit-model.component'
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
  {
    path: 'models-list',
    component: ModelsListComponent,
  },
  {
    path: 'edit-model/:id',
    component: EditModelComponent,
  },
  {
    path: 'add-model',
    component: AddModelComponent,
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
