import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'
import { switchMap } from 'rxjs'

import { CommonModule } from '@angular/common'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Device } from '../../../shared/device'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/DeviceTypes'
import { Model } from '../../../shared/model'
import Validation from '../../../shared/validation'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class DeviceAddComponent implements OnInit {
  device: Device
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  model: Model = new Model()
  modelList: Model[]
  valid: Validation = new Validation()

  addDeviceForm: FormGroup

  private initializeForm() {
    this.addDeviceForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      modelId: new FormControl('', Validators.required),
      position: new FormGroup({
        x: new FormControl<number>(0, [
          Validators.required,
          this.valid.numberValidator,
          Validators.min(-20),
          Validators.max(20),
        ]),
        y: new FormControl<number>(0, [
          Validators.required,
          this.valid.numberValidator,
          Validators.min(-20),
          Validators.max(20),
        ]),
        h: new FormControl<number>(0, [
          Validators.required,
          this.valid.numberValidator,
          Validators.min(-20),
          Validators.max(20),
        ]),
      }),
    })
  }

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public devicesService: DeviceService,
    private modelService: ModelsService,
    private logService: LogService,
  ) {
    this.initializeForm()
  }

  ngOnInit() {
    this.loadModels()
  }

  loadModels() {
    return this.modelService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data
    })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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

  get position() {
    return this.addDeviceForm.get('position')
  }

  get positionX() {
    return this.addDeviceForm.get('position')?.get('x')
  }

  get positionY() {
    return this.addDeviceForm.get('position')?.get('y')
  }

  get positionH() {
    return this.addDeviceForm.get('position')?.get('h')
  }

  toString(data: Record<string, unknown>): string {
    return JSON.stringify(data, null, ' ')
  }

  generateDevice() {
    this.addDeviceForm.controls.name.setValue(faker.company.name() + ' - ' + faker.company.buzzPhrase())
    const positionGroup = this.addDeviceForm.get('position') as FormGroup
    positionGroup.get('x')?.setValue(faker.number.int({ max: 10 }))
    positionGroup.get('y')?.setValue(faker.number.int({ max: 10 }))
    positionGroup.get('h')?.setValue(faker.number.int({ max: 10 }))
    if (this.modelList && this.modelList.length > 0) {
      this.addDeviceForm.controls.modelId.setValue(
        this.modelList[Math.floor(Math.random() * this.modelList.length)]._id.toString(),
      )
    } else {
      console.warn('Model list is empty or undefined. Cannot generate device modelId.')
    }
  }

  submitForm() {
    if (this.addDeviceForm.invalid) {
      return
    }
    console.log('Submit Form Add Device: ' + JSON.stringify(this.addDeviceForm.value))
    this.devicesService.CreateDevice(this.addDeviceForm.value).subscribe((res) => {
      console.log('Device response: ' + JSON.stringify(res, null, 2))
      this.isSubmitted = true
      const insertedId = (res as any).insertedId ? (res as any).insertedId : (res as any).id
      let device = this.addDeviceForm.value as Device
      device = { ...device, _id: insertedId || '' } // Ensure _id is set
      this.device = device
      console.log('Device with _id ' + insertedId + ' created: ' + JSON.stringify(device, null, 2))
      this.logService
        .CreateLog({
          message: device,
          objectId: insertedId,
          operation: 'Create',
          component: 'Device',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('device-list'))
        })
    })
  }
}
