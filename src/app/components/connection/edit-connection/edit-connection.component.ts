import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { v4 as uuidv4 } from 'uuid'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { Connection } from 'src/app/shared/connection'
import { ConnectionService } from 'src/app/services/connection.service'

import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { LogService } from 'src/app/services/log.service'

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss']
})
export class EditConnectionComponent implements OnInit {
  inputId: any

  EditConnectionForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(36)]),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    deviceIdTo: new FormControl('', Validators.required),
    deviceIdFrom: new FormControl('', Validators.required),
  })

  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()

  component = ''

  ngOnInit() {
    this.formConnection()
    this.getDeviceList()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.connection = this.getConnection(this.inputId)
    this.component = this.inputId
  }

  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService
  ) { }

  formConnection() {
    this.EditConnectionForm = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      deviceIdTo: ['', [Validators.required]],
      deviceIdFrom: ['', [Validators.required]],
    })
  }

  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('id')
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
    return this.EditConnectionForm.get('id')
  }
  get name() {
    return this.EditConnectionForm.get('name')
  }
  get deviceIdTo() {
    return this.EditConnectionForm.get('deviceIdTo')
  }
  get deviceIdFrom() {
    return this.EditConnectionForm.get('deviceIdFrom')
  }

  toString(data: any): string {
    return JSON.stringify(data)
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
    })
  }

  private getConnection(id: string): any {
    return this.connectionService
      .GetConnection(this.inputId)
      .subscribe((data: any) => {
        console.log('EditConnectionComponent.connectionService.GetConnection(' + this.inputId + ') => ' + JSON.stringify(data))
        this.connection = data
        this.EditConnectionForm.setValue(data)
      })
  }

  submitForm() {
    this.connectionService.UpdateConnection(this.inputId, this.EditConnectionForm.value as Connection)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.EditConnectionForm.get('id')?.value,
            message: this.toString(this.EditConnectionForm.value),
            operation: 'Update',
            component: 'Connection',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
            this.router.navigate(['connection-list'])
          })
      })
  }
}

