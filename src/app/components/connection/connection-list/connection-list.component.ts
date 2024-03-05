import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { LogService } from 'src/app/services/log.service'

import { Connection } from 'src/app/shared/connection'
import { ConnectionService } from 'src/app/services/connection.service'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss'],
})
export class ConnectionListComponent implements OnInit {
  connectionList: Connection[] = []
  selectedConnection: Connection = new Connection()
  connectionListPage = 1
  deviceList: Device[] = []
  component = 'Connection'

  ngOnInit() {
    this.loadConnection()
    this.getDeviceList()
  }

  constructor(
    public ConnectionService: ConnectionService,
    private router: Router,
    private ngZone: NgZone,
    private deviceService: DeviceService,
    private logService: LogService
  ) { }

  loadConnection() {
    return this.ConnectionService.GetConnections().subscribe((data: any) => {
      this.connectionList = data
    })
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
    })
  }

  findDevice(id: string): Device {
    let tmp: Device = new Device()
    tmp = this.deviceList.find((e: Device): boolean => e.id === id) || tmp
    return tmp
  }

  gotoDevice(deviceId: string) {
    this.router.navigate(['edit-device/', deviceId])
  }

  deleteConnection(id: string) {
    this.logService.CreateLog({
      message: id,
      objectId: id,
      operation: 'Delete',
      component: 'Connection',
    }).subscribe((data: any) => {
      console.log(data)
      this.loadConnection()
      this.router.navigate(['/connection-list'])
    })
    return this.ConnectionService.DeleteConnection(id).subscribe((data: any) => {
      console.log(data)
      this.loadConnection()
      this.router.navigate(['/connection-list'])
    })
  }

  async CloneConnection(id: string) {
    const id_new: string = this.ConnectionService.CloneConnection(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: 'Connection',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
      })
    // this.loadConnection()
    // this.router.navigate(['/attribute-dictionary-list'])
  }
  AddForm() {
    this.router.navigateByUrl('add-connection')
  }
  EditForm(Connection: Connection) {
    this.selectedConnection = Connection
    this.router.navigate(['edit-connection', this.selectedConnection.id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
