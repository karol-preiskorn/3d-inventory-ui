import { Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Device } from 'src/app/shared/device'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceType, DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { DevicesService } from './../../services/devices.service'
import { LogService } from './../../services/log.service'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
  inputId: any
  device: Device

  editForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
  })

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  isSubmitted = false

  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.device = this.getDevice()
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DevicesService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService
  ) {}

  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }

  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }

  // Access formcontrols getter

  get id() {
    return this.editForm.get('id')
  }
  get name() {
    return this.editForm.get('name')
  }
  get type() {
    return this.editForm.get('type')
  }
  get category() {
    return this.editForm.get('category')
  }

  toString(data: any): string {
    return JSON.stringify(data)
  }

  private getDevice(): any {
    console.log(this.inputId)

    return this.devicesService
      .GetDevice(this.inputId)
      .subscribe((data: any) => {
        console.log('GetDevice ' + JSON.stringify(data))
        this.device = data
        this.editForm.setValue(data)
      })
  }

  submitForm() {
    if (this.editForm.valid && this.editForm.touched) {
      this.logService.CreateLog({
        message: 'Submit device: ' + JSON.stringify(this.editForm.value),
        category: 'Info',
        component: 'EditDeviceComponent.SubmitForm',
      })

      this.devicesService
        .UpdateDevice(this.inputId, this.editForm.value)
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('devices-list'))
        })
    }
  }
}
