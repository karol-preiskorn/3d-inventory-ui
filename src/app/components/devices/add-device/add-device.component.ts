import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Device } from 'src/app/shared/device'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { LogService } from 'src/app/services/log.service'
import { DevicesService } from 'src/app/services/devices.service'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  addForm: FormGroup<{
    id: FormControl<string | null>
    name: FormControl<string | null>
    dimensions: FormControl<string | null>
    type: FormControl<string | null>
    category: FormControl<string | null>
  }> = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dimensions: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
  })
  device: Device
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  ngOnInit() {
    this.addDevice()
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public devicesService: DevicesService,
    private logService: LogService
  ) {}

  addDevice() {
    this.addForm = this.formBulider.group({
      id: [''],
      name: [''],
      dimensions: [''],
      type: [''],
      category: [''],
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeDimensions(e: any) {
    this.dimensions?.setValue(e.target.value, { onlySelf: true })
  }
  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }
  get id() {
    return this.addForm.get('id')
  }
  get name() {
    return this.addForm.get('name')
  }
  get dimensions() {
    return this.addForm.get('dimensions')
  }
  get type() {
    return this.addForm.get('type')
  }
  get category() {
    return this.addForm.get('category')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }

  get f() {
    return this.addForm.controls
  }
  submitForm() {
    this.devicesService.CreateDevice(this.device).subscribe((res) => {
      console.log('Device added!')
      this.logService.CreateLog({
        operation: 'Create',
        component: 'Device',
        message: this.toString(this.addForm.value),
      })
      this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
    })
  }
}
