import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'
import { CommonModule } from '@angular/common'
import { LogComponent } from '../../log/log.component'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  isLoading = false
  error: string | null = null

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
    private cdr: ChangeDetectorRef,
  ) {}

  loadConnection() {
    this.isLoading = true
    this.error = null

    return this.ConnectionService.GetConnections().subscribe({
      next: (data: Connection[]) => {
        this.connectionList = data
        this.isLoading = false
        this.cdr.detectChanges()
        console.warn('Loaded connections:', data.length)
      },
      error: (error) => {
        console.error('Error loading connections:', error)
        this.connectionList = []
        this.isLoading = false
        this.error = 'Failed to load connections'
        this.cdr.detectChanges()
      }
    })
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe({
      next: (data: Device[]) => {
        this.deviceList = data
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('Error loading devices:', error)
        this.deviceList = []
        this.cdr.detectChanges()
      }
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

    console.warn('Deleting connection with ID:', id)

    this.ConnectionService.DeleteConnection(id).subscribe({
      next: (data: Connection) => {
        console.warn('Connection deleted successfully:', data)
        this.logService
          .CreateLog({
            message: JSON.stringify({ id, deletedConnection: data, action: 'Delete connection' }),
            objectId: id,
            operation: 'Delete',
            component: 'connections',
          })
          .subscribe(() => {
            this.loadConnection()
            this.cdr.detectChanges()
          })
      },
      error: (error) => {
        console.error('Error deleting connection:', error)
        this.cdr.detectChanges()
      }
    })
  }

  cloneConnection(id: string) {
    if (!id) {
      console.error('Connection ID is required for cloning.')
      return
    }

    console.warn('Cloning connection with ID:', id)

    // Call the service to clone the connection
    const id_new = this.ConnectionService.CloneConnection(id)

    this.logService
      .CreateLog({
        message: JSON.stringify({ id, id_new, action: 'Clone connection' }),
        operation: 'Clone',
        component: 'connections',
      })
      .subscribe({
        next: () => {
          console.warn('Connection cloned successfully, new ID:', id_new)
          this.loadConnection()
          this.cdr.detectChanges()
        },
        error: (error) => {
          console.error('Error logging clone operation:', error)
          this.cdr.detectChanges()
        }
      })
  }

  // Debug method to test API integration
  debugConnectionAPI() {
    console.warn('=== CONNECTION API DEBUG ===')
    console.warn('Base URL:', this.ConnectionService.baseurl)
    console.warn('Connection count:', this.connectionList.length)
    console.warn('Device count:', this.deviceList.length)
    console.warn('Loading state:', this.isLoading)
    console.warn('Error state:', this.error)

    // Test API call
    this.ConnectionService.GetConnections().subscribe({
      next: (data) => {
        console.warn('API Test - Connections loaded:', data.length)
        console.warn('First connection:', data[0])
      },
      error: (error) => {
        console.error('API Test - Error:', error)
      }
    })
    console.warn('=== END DEBUG ===')
  }

  AddForm() {
    this.router.navigateByUrl('add-connection')
  }

  editConnection(Connection: Connection) {
    this.selectedConnection = Connection
    this.router.navigate(['edit-connection', this.selectedConnection._id])
  }
}
