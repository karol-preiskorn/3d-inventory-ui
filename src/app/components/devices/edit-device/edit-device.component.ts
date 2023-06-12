import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

import { Model } from 'src/app/shared/model'
import { ModelsService } from 'src/app/services/models.service'

import { LogService } from 'src/app/services/log.service'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
  inputId =''
  device: Device
  model: Model
  component: string
  modelList: Model[]
  form = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    modelId: new FormControl('', Validators.required),
    position: new FormGroup({
      x: new FormControl('', Validators.required),
      y: new FormControl('', Validators.required),
      h: new FormControl('', Validators.required),
    }),
  })
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  isSubmitted = false
  ngOnInit() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id') || ""
    this.inputId = id
    this.device = this.getDevice()
    this.loadModels()
    this.component = this.inputId
  }
  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DeviceService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService,
    private modelsService: ModelsService
  ) { }

  loadModels() {
    return this.modelsService.GetModels().subscribe((data: any) => {
      this.modelList = data
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

  get id() {
    return this.form.get('id')
  }
  get name() {
    return this.form.get('name')
  }
  get modelId() {
    return this.form.get('modelId')
  }

  toString(data: any): string {
    return JSON.stringify(data)
  }
  private getDevice(): any {
    return this.devicesService
      .GetDevice(this.inputId)
      .subscribe((data: any) => {
        console.log('GetDevice ' + JSON.stringify(data))
        this.device = data
        this.form.setValue(data)
      })
  }
  submitForm() {
    if (this.form.valid && this.form.touched) {
      console.log('submitForm(): ' + JSON.stringify(this.form.value, null, 2))
      this.logService.CreateLog({
        message: JSON.stringify(this.form.value, null, 2),
        operation: 'Update',
        component: 'Device',
        object: this.form.value.id,
      })
      this.devicesService
        .UpdateDevice(this.inputId, this.form.value)
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('device-list'))
        })
    }
  }
}
