import { DeviceService } from 'src/app/services/device.service'
import { LogIn, LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { Device } from 'src/app/shared/device'
import { Model } from 'src/app/shared/model'
import Validation from 'src/app/shared/validation'

import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class DeviceEditComponent implements OnInit {
  device: Device = new Device()
  modelList: Model[]
  valid: Validation = new Validation()

  editDeviceForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    modelId: new FormControl('', Validators.required),
    position: new FormGroup({
      x: new FormControl(0),
      y: new FormControl(0, [Validators.required, this.valid.numberValidator]),
      h: new FormControl(0, [Validators.required, this.valid.numberValidator]),
    }),
  })

  attributeComponent: string
  attributeComponentObject: string
  component: string

  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DeviceService,
    private router: Router,
    private logService: LogService,
    private modelsService: ModelsService,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.loadModels()
    this.device = this.devicesService.getDeviceSynchronize(id)
    this.editDeviceForm.patchValue({
      _id: this.device._id,
      name: this.device.name,
      modelId: this.device.modelId,
      position: {
        x: this.device.position.x,
        y: this.device.position.y,
        h: this.device.position.h,
      },
    })
  }

  loadModels(): void {
    this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data
    })
  }

  submitForm(): void {
    if (this.editDeviceForm.valid && this.editDeviceForm.touched) {
      console.log('DeviceEditComponent.submitForm(): ' + JSON.stringify(this.editDeviceForm.value, null, 2))
      const { _id } = this.editDeviceForm.value
      const log: LogIn = {
        message: this.editDeviceForm.value,
        operation: 'Update',
        component: 'Device',
        objectId: _id as string,
      }
      this.logService.CreateLog(log).subscribe(() => {
        this.devicesService.UpdateDevice(this.editDeviceForm.value as unknown as Device).subscribe(() => {
          this.router.navigate(['device-list'])
        })
      })
    }
  }

  get name() {
    return this.editDeviceForm.get('name')
  }

  get modelId() {
    return this.editDeviceForm.get('modelId') as FormControl
  }

  get x() {
    return this.editDeviceForm.get('x')
  }

  get y() {
    return this.editDeviceForm.get('y')
  }

  get h() {
    return this.editDeviceForm.get('h')
  }
}
