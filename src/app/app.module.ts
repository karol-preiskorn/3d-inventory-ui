import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AddDeviceComponent } from './components/add-device/add-device.component'
import { DevicesListComponent } from './components/devices-list/devices-list.component'
import { EditDeviceComponent } from './components/edit-device/edit-device.component'
import { CubeComponent } from './cube/cube.component'
import { DevicesComponent } from './devices/devices.component'
import { HomeComponent } from './home/home.component'
import { LogComponent } from './log/log.component'
import { ModelComponent } from './model/model.component'
import { DevicesService } from './services/devices.service'
import { LogService } from './services/log.service'
import { MarkdownModule } from 'ngx-markdown'
import { MarkdownReadmeComponent } from './markdown-readme/markdown-readme.component'
import { HttpClientXsrfModule } from '@angular/common/http'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'

@NgModule({
  declarations: [
    AddDeviceComponent,
    AppComponent,
    CubeComponent,
    DevicesComponent,
    DevicesListComponent,
    EditDeviceComponent,
    HomeComponent,
    LogComponent,
    ModelComponent,
    MarkdownReadmeComponent,
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
  exports: [DevicesComponent],
})
export class AppModule {}
