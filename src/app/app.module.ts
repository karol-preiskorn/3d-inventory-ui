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
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'

import { DeviceListComponent } from './components/devices/devices-list/devices-list.component'
import { DeviceAddComponent } from './components/devices/add-device/add-device.component'
import { DeviceEditComponent } from './components/devices/edit-device/edit-device.component'
import { DeviceService } from './services/device.service'

import { ModelsListComponent } from './components/models/models-list/models-list.component'
import { ModelAddComponent } from './components/models/add-model/add-model.component'
import { ModelEditComponent } from './components/models/edit-model/edit-model.component'
import { ModelsService } from './services/models.service'

import { AttributeDictionaryListComponent } from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component'
import { AttributeDictionaryAddComponent } from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component'
import { AttributeDictionaryEditComponent } from './components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component'
import { AttributeDictionaryService } from './services/attribute-dictionary.service'

import { AttributeListComponent } from './components/attribute/attribute-list/attribute-list.component'
import { AttributeAddComponent } from './components/attribute/add-attribute/add-attribute.component'
import { AttributeEditComponent } from './components/attribute/edit-attribute/edit-attribute.component'
import { AttributeService } from './services/attribute.service'

import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { CubeComponent } from './components/cube/cube.component'

import { LogComponent } from './components/log/log.component'
import { LogService } from './services/log.service'

import { ConnectionListComponent } from './components/connection/connection-list/connection-list.component'
import { ConnectionAddComponent } from './components/connection/add-connection/add-connection.component'
import { ConnectionEditComponent } from './components/connection/edit-connection/edit-connection.component'

import { FloorListComponent } from './components/floors/floor-list/floor-list.component'
import { FloorAddComponent } from './components/floors/add-floor/add-floor.component'
import { FloorEditComponent } from './components/floors/edit-floor/edit-floor.component'
import { FloorService } from './services/floor.service'

import { CustomErrorHandler } from './services/errorHandler.service'


@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceAddComponent,
    DeviceEditComponent,

    ModelsListComponent,
    ModelAddComponent,
    ModelEditComponent,

    AttributeDictionaryListComponent,
    AttributeDictionaryAddComponent,
    AttributeDictionaryEditComponent,

    AttributeListComponent,
    AttributeAddComponent,
    AttributeEditComponent,

    AppComponent,
    HomeComponent,
    CubeComponent,

    ConnectionListComponent,
    ConnectionAddComponent,
    ConnectionEditComponent,

    FloorListComponent,
    FloorEditComponent,
    FloorAddComponent,
    LogComponent,
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
    FloorService,
    CustomErrorHandler,
  ],
  bootstrap: [AppComponent],
  exports: [LogComponent],
})
export class AppModule { }
