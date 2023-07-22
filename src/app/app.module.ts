import {
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { MarkdownModule } from 'ngx-markdown'
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { DeviceListComponent } from './components/devices/devices-list/devices-list.component'
import { AddDeviceComponent } from './components/devices/add-device/add-device.component'
import { EditDeviceComponent } from './components/devices/edit-device/edit-device.component'
import { DeviceService } from './services/device.service'

import { ModelsListComponent } from './components/models/models-list/models-list.component'
import { AddModelComponent } from './components/models/add-model/add-model.component'
import { EditModelComponent } from './components/models/edit-model/edit-model.component'
import { ModelsService } from './services/models.service'

import { AttributeDictionaryListComponent } from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component'
import { AddAttributeDictionaryComponent } from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component'
import { EditAttributeDictionaryComponent } from './components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component'
import { AttributeDictionaryService } from './services/attribute-dictionary.service'

import { AddAttributeComponent } from './components/attribute/add-attribute/add-attribute.component'
import { AttributeListComponent } from './components/attribute/attribute-list/attribute-list.component'
import { EditAttributeComponent } from './components/attribute/edit-attribute/edit-attribute.component'
import { AttributeService } from './services/attribute.service'

import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { CubeComponent } from './components/cube/cube.component'
import { EnvironmentService } from './services/environment.service'

import { LogComponent } from './components/log/log.component'
import { LogService } from './services/log.service';
import { ConnectionListComponent } from './components/connection/connection-list/connection-list.component';
import { AddConnectionComponent } from './components/connection/add-connection/add-connection.component';
import { EditConnectionComponent } from './components/connection/edit-connection/edit-connection.component';

import { FloorListComponent } from './components/floors/floor-list/floor-list.component';
import { EditFloorComponent } from './components/floors/edit-floor/edit-floor.component';
import { AddFloorComponent } from './components/floors/add-floor/add-floor.component'


@NgModule({
  declarations: [
    DeviceListComponent,
    AddDeviceComponent,
    EditDeviceComponent,

    ModelsListComponent,
    AddModelComponent,
    EditModelComponent,

    AttributeDictionaryListComponent,
    AddAttributeDictionaryComponent,
    EditAttributeDictionaryComponent,

    AttributeListComponent,
    AddAttributeComponent,
    EditAttributeComponent,

    AppComponent,
    HomeComponent,
    CubeComponent,
    LogComponent,
    ConnectionListComponent,
    AddConnectionComponent,
    EditConnectionComponent,
    FloorListComponent,
    EditFloorComponent,
    AddFloorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClientModule }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    NgbPopoverModule
  ],
  providers: [
    DeviceService,
    ModelsService,
    LogService,
    HttpClient,
    AttributeDictionaryService,
    AttributeService,
    EnvironmentService,
  ],
  bootstrap: [AppComponent],
  exports: [LogComponent],
})
export class AppModule { }
