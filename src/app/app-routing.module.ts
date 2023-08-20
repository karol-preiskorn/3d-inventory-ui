import {Injectable, NgModule} from '@angular/core'
import {RouterModule, RouterStateSnapshot, Routes, TitleStrategy, provideRouter} from '@angular/router'
import {Title} from '@angular/platform-browser'

import {DeviceListComponent} from 'src/app/components/devices/devices-list/devices-list.component'
import {AddDeviceComponent} from 'src/app/components/devices/add-device/add-device.component'
import {EditDeviceComponent} from 'src/app/components/devices/edit-device/edit-device.component'

import {AttributeDictionaryListComponent} from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component'
import {AddAttributeDictionaryComponent} from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component'
import {EditAttributeDictionaryComponent} from './components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component'

import {ModelsListComponent} from './components/models/models-list/models-list.component'
import {AddModelComponent} from './components/models/add-model/add-model.component'
import {EditModelComponent} from './components/models/edit-model/edit-model.component'

import {AttributeListComponent} from './components/attribute/attribute-list/attribute-list.component'
import {AddAttributeComponent} from './components/attribute/add-attribute/add-attribute.component'
import {EditAttributeComponent} from './components/attribute/edit-attribute/edit-attribute.component'

import {ConnectionListComponent} from './components/connection/connection-list/connection-list.component'
import {AddConnectionComponent} from './components/connection/add-connection/add-connection.component'
import {EditConnectionComponent} from './components/connection/edit-connection/edit-connection.component'

import {FloorListComponent} from './components/floors/floor-list/floor-list.component'
import {AddFloorComponent} from './components/floors/add-floor/add-floor.component'
import {EditFloorComponent} from './components/floors/edit-floor/edit-floor.component'

import {CubeComponent} from './components/cube/cube.component'
import {HomeComponent} from './components/home/home.component'

@Injectable()
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

const routes: Routes = [
  // { path: '**', component: DeviceListComponent },
  //
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'cube',
    component: CubeComponent,
    title: '3d',
  },
  {
    path: 'device-list',
    component: DeviceListComponent,
    title: 'Device List',
  },
  {
    path: 'edit-device/:id',
    component: EditDeviceComponent,
    title: 'Edit Device',
  },
  {
    path: 'add-device',
    component: AddDeviceComponent,
    title: 'Add Device',
  },
  {
    path: 'models-list',
    component: ModelsListComponent,
    title: 'Models List',
  },
  {
    path: 'edit-model/:id',
    component: EditModelComponent,
    title: 'Edit Model',
  },
  {
    path: 'add-model',
    component: AddModelComponent,
    title: 'Add Model',
  },
  {
    path: 'attribute-dictionary-list',
    component: AttributeDictionaryListComponent,
    title: 'Attribute Dictionary List',
  },
  {
    path: 'add-attribute-dictionary',
    component: AddAttributeDictionaryComponent,
  },
  {
    path: 'edit-attribute-dictionary/:id',
    component: EditAttributeDictionaryComponent,
    title: 'Edit Attribute Dictionary',
  },
  {
    path: 'attribute-list',
    component: AttributeListComponent,
    title: 'Attribute List',
  },
  {
    path: 'add-attribute',
    component: AddAttributeComponent,
    title: 'Add Attribute',
  },
  {
    path: 'edit-attribute/:id',
    component: EditAttributeComponent,
    title: 'Edit Attribute',
  },
  {
    path: 'connection-list',
    component: ConnectionListComponent,
    title: 'Connections List',
  },
  {
    path: 'add-connection',
    component: AddConnectionComponent,
    title: 'Add Connections',
  },
  {
    path: 'edit-connection/:id',
    component: EditConnectionComponent,
    title: 'Edit Connections',
  },
  {
    path: 'floor-list',
    component: FloorListComponent,
    title: 'Floor List',
  },
  {
    path: 'add-floor',
    component: AddFloorComponent,
    title: 'Add Floor',
  },
  {
    path: 'edit-floor/:id',
    component: EditFloorComponent,
    title: 'Edit Floor',
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    // other imports here
  ],
  exports: [RouterModule],
  providers: [
    provideRouter(routes),
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy,
    },
  ],
})
export class AppRoutingModule {}
