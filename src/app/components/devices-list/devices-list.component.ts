import { DevicesService } from './../../services/devices.service'
import { Component, OnInit, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Device } from 'src/app/shared/device'
import { LogService } from '../../services/log.service'

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent implements OnInit {
  DevicesList: any = []

  ngOnInit() {
    this.loadDevices()
  }
  /**
   * Creates an instance of DevicesListComponent.
   * @param {DevicesService} devicesService
   * @param {LogService} logService
   * @param {NgZone} ngZone
   * @param {Router} router
   * @memberof DevicesListComponent
   */
  constructor(
    public devicesService: DevicesService,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
  ) {}
  /**
   *
   *
   * @return {*}
   * @memberof DevicesListComponent
   */
  loadDevices() {
    this.logService.add({
      message: 'Load data jonsonserver',
      category: 'info',
      component: 'ListComponent',
    })
    return this.devicesService.GetDevices().subscribe((data: any) => {
      this.DevicesList = data
    })
  }

  /**
   *
   *
   * @param {{ id: any }} data
   * @return {*}
   * @memberof DevicesListComponent
   */
  deleteDevice(data: { id: any }) {
    const index: any = this.DevicesList.map((x: any) => {
      return x.id
    }).indexOf(data.id)
    this.logService.add({
      message: 'Delete device: ' + data.id,
      category: 'Info',
      component: 'DevicesListComponent',
    })
  }
  /**
   *
   *
   * @memberof DevicesListComponent
   */
  AddForm() {
    this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
  }
}
