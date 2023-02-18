import { devices } from './devices'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubeComponent } from './cube/cube.component';
import { ModelComponent } from './model/model.component';
import { HomeComponent } from './home/home.component';
import { DeviceOperationsComponent } from './device-operations/device-operations.component';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "cube",
    component: CubeComponent
  },
  {
    path: "device-operations",
    component: DeviceOperationsComponent
  },
  {
    path: "model",
    component: ModelComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
