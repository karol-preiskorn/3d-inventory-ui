import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CubeComponent } from './cube/cube.component'
import { DeviceOperationsComponent } from './device-operations/device-operations.component'
import { DevicesComponent } from './devices/devices.component'
import { HomeComponent } from './home/home.component'
import { ModelComponent } from './model/model.component'
import { LogComponent } from './log/log.component'

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    ModelComponent,
    HomeComponent,
    DeviceOperationsComponent,
    DevicesComponent,
    LogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [DevicesComponent],
})
export class AppModule {}
