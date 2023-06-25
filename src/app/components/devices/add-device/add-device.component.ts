import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { v4 as uuidv4 } from 'uuid'

import { DeviceService } from 'src/app/services/device.service'
import { LogService } from 'src/app/services/log.service'
import { Device } from 'src/app/shared/device'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  addDeviceForm: FormGroup
  device: Device
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public devicesService: DeviceService,
    private logService: LogService
  ) {}
  ngOnInit() {
    this.addDevice()
  }

  addDevice() {
    this.addDeviceForm = this.formBuilder.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      modelId: ['', Validators.required],
      position: this.formBuilder.group({
        x: ['', Validators.required],
        y: ['', Validators.required],
        h: ['', Validators.required],
      }),
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeModelId(e: any) {
    this.modelId?.setValue(e.target.value, { onlySelf: true })
  }
  changeX(e: any) {
    this.x?.setValue(e.target.value, { onlySelf: true })
  }
  changeY(e: any) {
    this.y?.setValue(e.target.value, { onlySelf: true })
  }
  changeH(e: any) {
    this.h?.setValue(e.target.value, { onlySelf: true })
  }

  get id() {
    return this.addDeviceForm.get('id')
  }
  get name() {
    return this.addDeviceForm.get('name')
  }
  get modelId() {
    return this.addDeviceForm.get('modelId')
  }
  get position() {
    return this.addDeviceForm.get('position')?.get('x')
  }
  get x() {
    return this.addDeviceForm.get('x')
  }
  get y() {
    return this.addDeviceForm.get('y')
  }
  get h() {
    return this.addDeviceForm.get('h')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  get f() {
    return this.addDeviceForm.controls
  }
  submitForm() {
    this.devicesService.CreateDevice(this.device).subscribe((res) => {
      console.log('Device added!')
      this.logService.CreateLog({
        operation: 'Create',
        component: 'Devices',
        message: this.toString(this.addDeviceForm.value),
      })
      this.ngZone.run(() => this.router.navigateByUrl('device-list'))
    })
  }
}
