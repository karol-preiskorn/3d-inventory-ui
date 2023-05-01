import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AddDeviceComponent } from './components/devices/add-device/add-device.component'
import { DevicesListComponent } from './components/devices/devices-list/devices-list.component'
import { EditDeviceComponent } from './components/devices/edit-device/edit-device.component'
import { CubeComponent } from './components/cube/cube.component'
import { HomeComponent } from './components/home/home.component'
import { LogComponent } from './components/log/log.component'
import { DevicesService } from './services/devices.service'
import { LogService } from './services/log.service'
import { MarkdownModule } from 'ngx-markdown'
import { MarkdownReadmeComponent } from './components/markdown-readme/markdown-readme.component'
import { HttpClientXsrfModule } from '@angular/common/http'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { ModelsListComponent } from './components/models/models-list/models-list.component'
import { AddModelComponent } from './components/models/add-model/add-model.component'
import { EditModelComponent } from './components/models/edit-model/edit-model.component'

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
    BrowserModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
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
