import { v4 as uuidv4 } from 'uuid';

import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ComponentDictionary } from '../../../shared/component-dictionary'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss'],
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
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
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
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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
  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }
  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
    })
  }
  gotoDevice(deviceId: string) {
    this.router.navigate(['edit-device/', deviceId])
  }
  submitForm() {
    this.connectionService.CreateConnection(this.addConnectionForm.value as Connection).subscribe(() => {
      this.logService
        .CreateLog({
          objectId: this.addConnectionForm.get('id')?.value,
          message: this.addConnectionForm.value,
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
