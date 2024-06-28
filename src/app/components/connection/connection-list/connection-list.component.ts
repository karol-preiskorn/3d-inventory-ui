import { ObjectId } from 'mongodb';
import { ConnectionService } from 'src/app/services/connection.service';
import { DeviceService } from 'src/app/services/device.service';
import { LogIn, LogService } from 'src/app/services/log.service';
import { Connection } from 'src/app/shared/connection';
import { Device } from 'src/app/shared/device';

import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private logService: LogService,
  ) {}

  loadConnection() {
    return this.ConnectionService.GetConnections().subscribe((data: Connection[]) => {
      this.connectionList = data
    })
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
    })
  }

  findDevice(id: ObjectId): Device {
    let tmp: Device = new Device()
    tmp = this.deviceList.find((e: Device): boolean => e._id === id) || tmp
    return tmp
  }

  gotoDevice(deviceId: ObjectId) {
    this.router.navigate(['edit-device/', deviceId])
  }

  deleteConnection(id: ObjectId) {
    this.logService
      .CreateLog({
        message: { id: id },
        objectId: id,
        operation: 'Delete',
        component: 'Connection',
      })
      .subscribe((data: LogIn) => {
        console.log(data)
        this.loadConnection()
        this.router.navigate(['/connection-list'])
      })
    return this.ConnectionService.DeleteConnection(id).subscribe((data: Connection) => {
      console.log(data)
      this.loadConnection()
      this.router.navigate(['/connection-list'])
    })
  }

  async cloneConnection(id: ObjectId) {
    const id_new: string = this.ConnectionService.CloneConnection(id)
    this.logService
      .CreateLog({
        message: { id: id, id_new: id_new },
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
  editConnection(Connection: Connection) {
    this.selectedConnection = Connection
    this.router.navigate(['edit-connection', this.selectedConnection._id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
