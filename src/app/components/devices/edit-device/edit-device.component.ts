import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DevicesService } from 'src/app/services/devices.service'
import { LogService } from 'src/app/services/log.service'
import { Device } from 'src/app/shared/device'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { Model } from 'src/app/shared/model'
import { ModelsService } from 'src/app/services/models.service'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
  inputId: any
  device: Device
  model: Model
  component = ''
  modelsList: Model[]
  form = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    model_id: new FormControl('', Validators.required),
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
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.device = this.getDevice()
    this.loadModels()
    this.component = this.inputId
  }
  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DevicesService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService,
    private modelsService: ModelsService
  ) {}
  loadModels() {
    return this.modelsService.GetModels().subscribe((data: any) => {
      this.modelsList = data
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeModel(e: any) {
    this.model.id = e.target.value
  }
  get id() {
    return this.form.get('id')
  }
  get name() {
    return this.form.get('name')
  }
  get _model() {
    return this.form.get('model')
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
      this.logService.CreateLog({
        message: JSON.stringify(this.form.value, null, 2),
        operation: 'Update',
        component: 'Device',
        object: this.form.value.id,
      })
      this.devicesService
        .UpdateDevice(this.inputId, this.form.value)
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
        })
    }
  }
}
