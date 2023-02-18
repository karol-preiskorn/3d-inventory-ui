import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';
import { ModelComponent } from './model/model.component';
import { HomeComponent } from './home/home.component';
import { DeviceOperationsComponent } from './device-operations/device-operations.component';

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    ModelComponent,
    HomeComponent,
    DeviceOperationsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
