import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { CommonModule } from '@angular/common'
import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ComponentDictionary } from '../../../shared/ComponentDictionary'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'

@Component({
  selector: 'app-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ConnectionAddComponent implements OnInit {
  addConnectionForm: FormGroup
  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent = 'Connection'

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService,
  ) {}

  formConnection() {
    this.addConnectionForm = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      deviceIdTo: ['', [Validators.required]],
      deviceIdFrom: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.formConnection()
    this.getDeviceList()
  }

  changeId(e: Event) {
    this._id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDeviceTo(e: Event) {
    this.deviceIdTo?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDeviceFrom(e: Event) {
    this.deviceIdFrom?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get _id() {
    return this.addConnectionForm.get('_id')
  }

  get name() {
    return this.addConnectionForm.get('name')
  }

  get deviceIdTo() {
    return this.addConnectionForm.get('deviceIdTo')
  }

  get deviceIdFrom() {
    return this.addConnectionForm.get('deviceIdFrom')
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }

  deviceListSubscription: { unsubscribe: () => void } | undefined

  getDeviceList() {
    this.deviceListSubscription = this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
    })
  }

  ngOnDestroy() {
    if (this.deviceListSubscription) {
      this.deviceListSubscription.unsubscribe()
    }
  }

  gotoDevice(deviceId: string) {
    this.router.navigate(['edit-device/', deviceId])
  }

  submitForm() {
    this.connectionService.CreateConnection(this.addConnectionForm.value as Connection).subscribe({
      next: (connection: Connection | Record<string, unknown>) => {
        // Validate response structure
        if (!connection) {
          console.error('Connection creation failed: No response from server')
          return
        }

        const connectionRecord = connection as Record<string, unknown>
        const insertedId = (connectionRecord.insertedId as string) || (connectionRecord._id as string) || ''

        if (!insertedId) {
          console.error('Connection creation failed: No ID returned from server', connection)
          return
        }

        const createdConnection = this.addConnectionForm.value
        createdConnection._id = insertedId

        this.logService
          .CreateLog({
            objectId: insertedId,
            message: createdConnection,
            operation: 'Create',
            component: 'connections',
          })
          .subscribe({
            next: () => {
              this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
            },
            error: (error) => {
              console.error('Failed to create log entry:', error)
              // Still navigate even if logging fails
              this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
            }
          })
      },
      error: (error) => {
        console.error('Error creating connection:', error)
        // Optionally, provide user feedback here, e.g.:
        // this.errorMessage = 'Failed to create connection. Please try again.'
      },
    })
  }
}
