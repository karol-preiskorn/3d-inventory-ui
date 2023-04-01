import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { ApiModule } from 'projects/swagger-client/src/api.module'
import { Configuration } from 'projects/swagger-client/src/configuration'
import { BASE_PATH } from 'swagger-client'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CubeComponent } from './cube/cube.component'
import { DeviceOperationsComponent } from './device-operations/device-operations.component'
import { DevicesComponent } from './devices/devices.component'
import { HomeComponent } from './home/home.component'
import { LogComponent } from './log/log.component'
import { ModelComponent } from './model/model.component'

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
    ApiModule.forRoot(getApiConfiguration),
  ],
  providers: [{ provide: BASE_PATH, useValue: 'http://localhost:8080' }],
  bootstrap: [AppComponent],
  exports: [DevicesComponent],
})
export class AppModule {}
function getApiConfiguration(): Configuration {
  try {
    console.log('✳️ getApiConfiguration')
  } catch (error) {
    throw new Error('Function getApiConfiguration not implemented.')
  }
}
