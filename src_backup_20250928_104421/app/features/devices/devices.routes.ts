import { Routes } from '@angular/router'

export const DEVICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/devices/devices-list/devices-list.component').then(m => m.DeviceListComponent),
    title: 'Device List'
  },
  {
    path: 'add',
    loadComponent: () => import('../../components/devices/add-device/add-device.component').then(m => m.DeviceAddComponent),
    title: 'Add Device'
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../../components/devices/edit-device/edit-device.component').then(m => m.DeviceEditComponent),
    title: 'Edit Device'
  }
]
