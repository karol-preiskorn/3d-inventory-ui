import { CommonModule } from '@angular/common'
import { Injectable, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { provideRouter, RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router'

import { CubeComponent } from './components/3d/3d.component'
import { AttributeDictionaryAddComponent } from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component'
import { AttributeDictionaryListComponent } from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component'
import { AttributeDictionaryEditComponent } from './components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component'
import { AttributeAddComponent } from './components/attribute/add-attribute/add-attribute.component'
import { AttributeListComponent } from './components/attribute/attribute-list/attribute-list.component'
import { AttributeEditComponent } from './components/attribute/edit-attribute/edit-attribute.component'
import { ConnectionAddComponent } from './components/connection/add-connection/add-connection.component'
import { ConnectionListComponent } from './components/connection/connection-list/connection-list.component'
import { ConnectionEditComponent } from './components/connection/edit-connection/edit-connection.component'
import { DeviceAddComponent } from './components/devices/add-device/add-device.component'
import { DeviceListComponent } from './components/devices/devices-list/devices-list.component'
import { DeviceEditComponent } from './components/devices/edit-device/edit-device.component'
import { FloorAddComponent } from './components/floors/add-floor/add-floor.component'
import { FloorEditComponent } from './components/floors/edit-floor/edit-floor.component'
import { FloorListComponent } from './components/floors/floor-list/floor-list.component'
import { HomeComponent } from './components/home/home.component'
import { ModelAddComponent } from './components/models/add-model/add-model.component'
import { ModelEditComponent } from './components/models/edit-model/edit-model.component'
import { ModelsListComponent } from './components/models/model-list/model-list.component'
import { ResolverDevice } from './resolverDevice'
import { ResolverModel } from './resolverModel'

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
    path: '3d',
    component: CubeComponent,
    title: '3d',
    resolve: {
      resolveDeviceList: ResolverDevice,
      resolveModelList: ResolverModel,
    },
  },
  {
    path: 'device-list',
    component: DeviceListComponent,
    title: 'Device List',
  },
  {
    path: 'edit-device/:id',
    component: DeviceEditComponent,
    title: 'Edit Device',
  },
  {
    path: 'add-device',
    component: DeviceAddComponent,
    title: 'Add Device',
  },
  {
    path: 'models-list',
    component: ModelsListComponent,
    title: 'Models List',
  },
  {
    path: 'edit-model/:id',
    component: ModelEditComponent,
    title: 'Edit Model',
  },
  {
    path: 'add-model',
    component: ModelAddComponent,
    title: 'Add Model',
  },
  {
    path: 'attribute-dictionary-list',
    component: AttributeDictionaryListComponent,
    title: 'Attribute Dictionary List',
  },
  {
    path: 'add-attribute-dictionary',
    component: AttributeDictionaryAddComponent,
  },
  {
    path: 'edit-attribute-dictionary/:id',
    component: AttributeDictionaryEditComponent,
    title: 'Edit Attribute Dictionary',
  },
  {
    path: 'attribute-list',
    component: AttributeListComponent,
    title: 'Attribute List',
  },
  {
    path: 'add-attribute',
    component: AttributeAddComponent,
    title: 'Add Attribute',
  },
  {
    path: 'edit-attribute/:id',
    component: AttributeEditComponent,
    title: 'Edit Attribute',
  },
  {
    path: 'connection-list',
    component: ConnectionListComponent,
    title: 'Connections List',
  },
  {
    path: 'add-connection',
    component: ConnectionAddComponent,
    title: 'Add Connections',
  },
  {
    path: 'edit-connection/:id',
    component: ConnectionEditComponent,
    title: 'Edit Connections',
  },
  {
    path: 'floor-list',
    component: FloorListComponent,
    title: 'Floor List',
  },
  {
    path: 'add-floor',
    component: FloorAddComponent,
    title: 'Add Floor',
  },
  {
    path: 'edit-floor/:id',
    component: FloorEditComponent,
    title: 'Edit Floor',
  },
]

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false }, // <-- debugging purposes only
    ),
    CommonModule,
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
