import { NgModule } from '@angular/core'
import { RouterModule, Routes, provideRouter } from '@angular/router'
import { CubeComponent } from './components/cube/cube.component'
import { AddDeviceComponent } from 'src/app/components/devices/add-device/add-device.component'
import { DevicesListComponent } from 'src/app/components/devices/devices-list/devices-list.component'
import { EditDeviceComponent } from 'src/app/components/devices/edit-device/edit-device.component'
import { AttributeDictionaryListComponent } from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component'
import { AddAttributeDictionaryComponent } from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component'
import { HomeComponent } from './components/home/home.component'
import { AddModelComponent } from './components/models/add-model/add-model.component'
import { EditModelComponent } from './components/models/edit-model/edit-model.component'
import { ModelsListComponent } from './components/models/models-list/models-list.component'

const routes: Routes = [
  // { path: '**', component: DevicesListComponent },
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
  {
    path: 'attribute-dictionary-list',
    component: AttributeDictionaryListComponent,
  },
  {
    path: 'add-attribute-dictionary',
    component: AddAttributeDictionaryComponent,
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    // other imports here
  ],
  exports: [RouterModule],
  providers: [provideRouter(routes)],
})
export class AppRoutingModule {}
