/*
 * File:        @/src/app/components/devices/edit-device/edit-device.component.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date        By       Comments
 * ----------  -------  ------------------------------
 * 2023-08-08  C2RLO    add FormControl<number>(0,
 */



import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

import { Model } from 'src/app/shared/model'
import { ModelsService } from 'src/app/services/models.service'

import { LogIn, LogService } from 'src/app/services/log.service'
import Validation from 'src/app/shared/validation'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class DeviceEditComponent implements OnInit {
  errorMessage: string
  valid: Validation = new Validation()
  inputId = ''
  device: Device = new Device()
  model: Model = new Model()
  modelList: Model[]

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()

  component = ''
  attributeComponent = 'Device'
  attributeComponentObject: string = ''

  isSubmitted = false
  action = ''

  editDeviceForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    modelId: new FormControl('', Validators.required),
    position: new FormGroup({
      x: new FormControl<number>(0, [Validators.required, this.valid.numberValidator]),
      y: new FormControl<number>(0, [Validators.required, this.valid.numberValidator]),
      h: new FormControl<number>(0, [Validators.required, this.valid.numberValidator]),
    }),
  })

  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DeviceService,
    private router: Router,
    private logService: LogService,
    private modelsService: ModelsService
  ) { }

  loadModels() {
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data as Model[]
    })
  }
  ngOnInit() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.inputId = id
    this.loadModels()
    this.device = this.devicesService.getDeviceSynchronize(id)
    this.attributeComponentObject = JSON.stringify(this.device)
    this.component = this.inputId
    this.attributeComponent = 'Device'
    this.attributeComponentObject = JSON.stringify(this.device)
    console.log('edit-device.attributeComponent = ' + this.attributeComponent)
    console.log('edit-device.attributeComponentObject = ' + this.attributeComponentObject)
    this.editDeviceForm.patchValue(this.device)
    //this.getDevice()
    console.log('edit-device.attributeComponent = ' + this.attributeComponent)
    console.log('edit-device.attributeComponentObject = ' + this.attributeComponentObject)
  }

  reloadComponent(self: boolean, urlToNavigateTo?: string) {
    //skipLocationChange:true means don't update the url to / when navigating
    //console.log('Current route I am on:', this.router.url)
    const url = self ? this.router.url : urlToNavigateTo
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
        console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeX(e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value)
    this.x?.setValue(value, { onlySelf: true })
  }

  changeY(e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value)
    this.y?.setValue(value, { onlySelf: true })
  }

  changeH(e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value)
    this.h?.setValue(value, { onlySelf: true })
  }

  changeModelId(e: Event) {
    this.modelId?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get id() {
    return this.editDeviceForm.get('id')
  }

  get name() {
    return this.editDeviceForm.get('name')
  }

  get x() {
    return this.editDeviceForm.get('position')?.get('x')
  }

  get y() {
    return this.editDeviceForm.get('position')?.get('y')
  }

  get h() {
    return this.editDeviceForm.get('position')?.get('h')
  }

  get modelId() {
    return this.editDeviceForm.get('modelId')
  }

  submitForm() {
    if (this.editDeviceForm.valid && this.editDeviceForm.touched) {
      console.log('DeviceEditComponent.submitForm(): ' + JSON.stringify(this.editDeviceForm.value, null, 2))
      const log: LogIn = {
        message: JSON.stringify(this.editDeviceForm.value) as string,
        operation: 'Update',
        component: 'Devices',
        object: this.editDeviceForm.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        this.action = JSON.stringify(log)
        //this.reloadComponent(false, 'edit-device/' + this.device.id)
      })
      this.devicesService.UpdateDevice(this.inputId, this.editDeviceForm.value as Device).subscribe(() => {
        //  this.ngZone.run(() => this.router.navigateByUrl('device-list'))
        this.router.navigate(['device-list'])
        // @TODO: #64 goto specific row in list when return form list
        // this.router.navigate(['device-list/', this.device.id])
        // this.router.navigateByUrl('/edit-device', { skipLocationChange: true }).then(() => {
        //   this.router.navigate(['edit-device'])
        // })
      })
    }
  }
}
