import {Component, NgZone, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {LogService} from 'src/app/services/log.service'
import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import Validation from 'src/app/shared/validation'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  device: Device
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  model: Model = new Model()
  modelList: Model[]
  valid: Validation = new Validation()

  addDeviceForm = new FormGroup({
    id: new FormControl(uuidv4(), [Validators.required, Validators.minLength(4)]),
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
    private logService: LogService
  ) {}

  ngOnInit() {
    this.loadModels()
  }

  loadModels() {
    const tmp: Model = new Model()
    return this.modelService.GetModels().subscribe((data: any) => {
      this.modelList = data
      this.modelList.unshift(tmp)
    })
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, {onlySelf: true})
  }

  changeName(e: any) {
    this.name?.setValue(e.target.value, {onlySelf: true})
  }

  changeX(e: any) {
    this.x?.setValue(e.target.value, {onlySelf: true})
  }

  changeY(e: any) {
    this.y?.setValue(e.target.value, {onlySelf: true})
  }

  changeH(e: any) {
    this.h?.setValue(e.target.value, {onlySelf: true})
  }

  changeModelId(e: any) {
    this.modelId?.setValue(e.target.value, {onlySelf: true})
  }

  get id() {
    return this.addDeviceForm.get('id')
  }

  get name() {
    return this.addDeviceForm.get('name')
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

  get modelId() {
    return this.addDeviceForm.get('modelId')
  }

  toString(data: any): string {
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
      component: 'Devices',
      message: this.toString(this.addDeviceForm.value),
    })
    this.devicesService.CreateDevice(this.device).subscribe((res) => {
      this.ngZone.run(() => this.router.navigateByUrl('device-list'))
    })
  }
}
