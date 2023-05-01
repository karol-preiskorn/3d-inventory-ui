import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { MarkdownModule } from 'ngx-markdown'
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CubeComponent } from './components/cube/cube.component'
import { AddDeviceComponent } from './components/devices/add-device/add-device.component'
import { DevicesListComponent } from './components/devices/devices-list/devices-list.component'
import { EditDeviceComponent } from './components/devices/edit-device/edit-device.component'
import { HomeComponent } from './components/home/home.component'
import { LogComponent } from './components/log/log.component'
import { MarkdownReadmeComponent } from './components/markdown-readme/markdown-readme.component'
import { AddModelComponent } from './components/models/add-model/add-model.component'
import { EditModelComponent } from './components/models/edit-model/edit-model.component'
import { ModelsListComponent } from './components/models/models-list/models-list.component'
import { DevicesService } from './services/devices.service'
import { LogService } from './services/log.service'

@NgModule({
  declarations: [
    AddDeviceComponent,
    AppComponent,
    CubeComponent,
    DevicesListComponent,
    EditDeviceComponent,
    HomeComponent,
    LogComponent,
    MarkdownReadmeComponent,
    ModelsListComponent,
    AddModelComponent,
    EditModelComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClientModule }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    BsDropdownModule.forRoot(),
  ],
  providers: [DevicesService, LogService],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
