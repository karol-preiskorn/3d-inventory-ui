import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogIn, LogService } from '../../../services/log.service'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'
import { CommonModule } from '@angular/common'
import { LogComponent } from '../../log/log.component'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss'],
  imports: [CommonModule, LogComponent, NgbPaginationModule],
  standalone: true,
})
export class ConnectionListComponent implements OnInit {
  connectionList: Connection[] = []
  selectedConnection: Connection = new Connection()
  connectionListPage = 1
  deviceList: Device[] = []
  component = 'connections'
  componentName = 'Connections'
  page: number = 1
  totalItems: number = 0
  pageSize: number = 5

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
      this.deviceList = data
    })
  }

  findDevice(id: string): Device {
    let device: Device = new Device()
    device = this.deviceList.find((e: Device): boolean => e._id === id) || device
    return device
  }

  gotoDevice(deviceId: string) {
    this.router.navigate(['edit-device/', deviceId])
  }

  deleteConnection(id: string) {
    if (!id) {
      console.error('Connection ID is required for deletion.')
      return
    }
    this.logService
      .CreateLog({
        message: { id: id },
        objectId: id,
        operation: 'Delete',
        component: 'connections',
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

  async cloneConnection(id: string) {
    if (!id) {
      console.error('Connection ID is required for cloning.')
      return
    }
    console.log('Cloning connection with ID:', id)
    // Call the service to clone the connection
    const id_new = this.ConnectionService.CloneConnection(id);
    this.logService
      .CreateLog({
        message: { id: id, id_new: id_new },
        operation: 'Clone',
        component: 'connections',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
      })
  }

  AddForm() {
    this.router.navigateByUrl('add-connection')
  }

  editConnection(Connection: Connection) {
    this.selectedConnection = Connection
    this.router.navigate(['edit-connection', this.selectedConnection._id])
  }
}
