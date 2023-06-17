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

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
  inputId = ''
  device: Device = new Device()
  model: Model = new Model()
  component = ''
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
  action = ''
  ngOnInit() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id') || ""
    this.inputId = id
    this.getDevice()
    this.loadModels()
    this.component = this.inputId
    console.log('EditDeviceComponent.ngOnInit set component =' + this.component)
  }
  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DeviceService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService,
    private modelsService: ModelsService
  ) { }

  reloadComponent(self: boolean, urlToNavigateTo?: string) {
    //skipLocationChange:true means dont update the url to / when navigating
    console.log("Current route I am on:", this.router.url)
    const url = self ? this.router.url : urlToNavigateTo
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
        console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

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
  private getDevice() {
    return this.devicesService
      .GetDevice(this.inputId)
      .subscribe((data: Device) => {
        console.log('EditDeviceComponent.GetDevice ' + JSON.stringify(data))
        this.device = data
        this.form.patchValue(data)
      })
  }
  submitForm() {
    if (this.form.valid && this.form.touched) {
      console.log('EditDeviceComponent.submitForm(): ' + JSON.stringify(this.form.value, null, 2))
      const log: LogIn = {
        message: JSON.stringify(this.form.value) as string,
        operation: 'Update',
        component: 'Devices',
        object: this.form.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        this.action = JSON.stringify(log)
        //this.reloadComponent(false, 'edit-device/' + this.device.id)
      })
      this.devicesService
        .UpdateDevice(this.inputId, this.form.value)
        .subscribe(() => {
          // this.ngZone.run(() => this.router.navigateByUrl('device-list'))
          this.router.navigate(['edit-device/', this.device.id])
          // this.router.navigateByUrl('/edit-device', { skipLocationChange: true }).then(() => {
          //   this.router.navigate(['edit-device'])
          // })
        })
    }
  }
}
