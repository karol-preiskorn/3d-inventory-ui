import { DeviceService } from 'src/app/services/device.service'
import { LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { Device } from 'src/app/shared/device'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { Model } from 'src/app/shared/model'
import Validation from 'src/app/shared/validation'

import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class DeviceAddComponent implements OnInit {
  device: Device
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  model: Model = new Model()
  modelList: Model[]
  valid: Validation = new Validation()

  addDeviceForm = new FormGroup({
    id: new FormControl('', null),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    modelId: new FormControl('', Validators.required),
    position: new FormGroup({
      x: new FormControl<number>(0, [Validators.required, this.valid.numberValidator]),
      y: new FormControl<number>(0, [Validators.required, this.valid.numberValidator]),
      h: new FormControl<number>(0, [Validators.required, this.valid.numberValidator]),
    }),
  })

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public devicesService: DeviceService,
    private modelService: ModelsService,
    private logService: LogService,
  ) {}

  ngOnInit() {
    this.loadModels()
  }
  loadModels() {
    return this.modelService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data as Model[]
    })
  }
  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }
  changeX(e: Event) {
    this.x?.setValue(Number((e.target as HTMLInputElement).value), { onlySelf: true })
  }
  changeY(e: Event) {
    this.y?.setValue(Number((e.target as HTMLInputElement).value), { onlySelf: true })
  }
  changeH(e: Event) {
    this.h?.setValue(Number((e.target as HTMLInputElement).value), { onlySelf: true })
  }
  changeModelId(e: Event) {
    this.modelId?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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
  get x() {
    return this.addDeviceForm.get('position')?.get('x')
  }
  get y() {
    return this.addDeviceForm.get('position')?.get('y')
  }
  get h() {
    return this.addDeviceForm.get('position')?.get('h')
  }

  toString(data: Record<string, unknown>): string {
    return JSON.stringify(data, null, ' ')
  }

  generateDevice() {
    this.addDeviceForm.controls.name.setValue(faker.company.name() + ' - ' + faker.company.buzzPhrase())
    this.addDeviceForm.controls.position.controls.x.setValue(faker.number.int(10))
    this.addDeviceForm.controls.position.controls.y.setValue(faker.number.int(10))
    this.addDeviceForm.controls.position.controls.h.setValue(faker.number.int(10))
    this.addDeviceForm.controls.modelId.setValue(this.modelList[Math.floor(Math.random() * this.modelList.length)].id)
  }

  submitForm() {
    console.log('Device added!')
    this.logService.CreateLog({
      operation: 'Create',
      component: 'Device',
      // objectId: res._id,
      message: this.addDeviceForm.value,
    })
    this.devicesService.CreateDevice(this.device).subscribe(() => {
      // Removed 'res' parameter
      this.ngZone.run(() => this.router.navigateByUrl('device-list'))
    })
  }
}
