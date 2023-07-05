import {Component, NgZone, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import {LogIn, LogService} from 'src/app/services/log.service'
import Validation from 'src/app/shared/validation'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {

  valid: Validation = new Validation()
  inputId = ''
  device: Device = new Device()
  model: Model = new Model()
  modelList: Model[]
  component = ''
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  isSubmitted = false
  action = ''

  editDeviceForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    modelId: new FormControl('', Validators.required),
    position: new FormGroup({
      x: new FormControl('', [Validators.required, this.valid.numberValidator]),
      y: new FormControl('', [Validators.required, this.valid.numberValidator]),
      h: new FormControl('', [Validators.required, this.valid.numberValidator]),
    }),
  })

  ngOnInit() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id') || ''
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
  ) {}

  reloadComponent(self: boolean, urlToNavigateTo?: string) {
    //skipLocationChange:true means dont update the url to / when navigating
    console.log('Current route I am on:', this.router.url)
    const url = self ? this.router.url : urlToNavigateTo
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
        console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

  loadModels() {
    const tmp: Model = new Model()
    return this.modelsService.GetModels().subscribe((data: any) => {
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

  toString(data: any): string {
    return JSON.stringify(data)
  }

  private getDevice() {
    return this.devicesService.GetDevice(this.inputId).subscribe((data: Device) => {
      console.log('EditDeviceComponent.GetDevice ' + JSON.stringify(data))
      this.device = data
      this.editDeviceForm.patchValue(data)
    })
  }

  submitForm() {
    if (this.editDeviceForm.valid && this.editDeviceForm.touched) {
      console.log('EditDeviceComponent.submitForm(): ' + JSON.stringify(this.editDeviceForm.value, null, 2))
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
      this.devicesService.UpdateDevice(this.inputId, this.editDeviceForm.value).subscribe(() => {
      //   // this.ngZone.run(() => this.router.navigateByUrl('device-list'))
        this.router.navigate(['device-list'])
        // TODO: goto specyfic row in list
        // this.router.navigate(['device-list/', this.device.id])
        // this.router.navigateByUrl('/edit-device', { skipLocationChange: true }).then(() => {
        //   this.router.navigate(['edit-device'])
        // })
      })
    }
  }
}
