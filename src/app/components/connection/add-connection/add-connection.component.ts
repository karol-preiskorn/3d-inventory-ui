import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { v4 as uuidv4 } from 'uuid'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { Connection } from 'src/app/shared/connection'
import { ConnectionService } from 'src/app/services/connection.service'

import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { LogService } from 'src/app/services/log.service'

@Component({
  selector: 'app-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss']
})
export class ConnectionAddComponent implements OnInit {
  addConnectionForm: FormGroup
  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent = 'Connection'

  constructor(
    private formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService
  ) { }
  ngOnInit() {
    this.formConnection()
    this.getDeviceList()
  }
  formConnection() {
    this.addConnectionForm = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      deviceIdTo: ['', [Validators.required]],
      deviceIdFrom: ['', [Validators.required]],
    })
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeDeviceTo(e: any) {
    this.deviceIdTo?.setValue(e.target.value, { onlySelf: true })
  }
  changeDeviceFrom(e: any) {
    this.deviceIdFrom?.setValue(e.target.value, { onlySelf: true })
  }

  get id() {
    return this.addConnectionForm.get('id')
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

  toString(data: any): string {
    return JSON.stringify(data, null, 2)
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
    })
  }

  gotoDevice(deviceId: string) {
    this.router.navigate(['edit-device/', deviceId])
  }

  submitForm() {
    this.connectionService.CreateConnection(this.addConnectionForm.value as Connection)
      .subscribe(() => {
        this.logService
          .CreateLog({
            objectId: this.addConnectionForm.get('id')?.value,
            message: this.toString(this.addConnectionForm.value),
            operation: 'Create',
            component: 'Connection',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
            this.router.navigate(['connection-list'])
          })
      })
  }
}
