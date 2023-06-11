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
export class AddConnectionComponent implements OnInit {
  addConnectionFrom = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(36)]),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    deviceIdTo: new FormControl('', Validators.required),
    deviceIdFrom: new FormControl('', Validators.required),
  })
  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent = 'Connection'

  ngOnInit() {
    this.formConnection()
    this.getDeviceList()
  }

  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService
  ) { }

  formConnection() {
    this.addConnectionFrom = this.formBulider.group({
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
    return this.addConnectionFrom.get('id')
  }
  get name() {
    return this.addConnectionFrom.get('name')
  }
  get deviceIdTo() {
    return this.addConnectionFrom.get('deviceIdTo')
  }
  get deviceIdFrom() {
    return this.addConnectionFrom.get('deviceIdFrom')
  }

  toString(data: any): string {
    return JSON.stringify(data)
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      this.deviceList = data
    })
  }

  submitForm() {
    this.connectionService.CreateConnection(this.addConnectionFrom.value as Connection)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.addConnectionFrom.get('id')?.value,
            message: this.toString(this.addConnectionFrom.value),
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
