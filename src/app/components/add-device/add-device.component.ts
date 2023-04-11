import { Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { Device } from 'src/app/shared/device'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceType, DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { LogService } from '../../services/log.service'
import { DevicesService } from './../../services/devices.service'
import { LogComponent } from 'src/app/log/log.component'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  addForm: FormGroup<{
    id: FormControl<string | null>
    name: FormControl<string | null>
    type: FormControl<string | null>
    category: FormControl<string | null>
  }> = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
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
      type: [''],
      category: [''],
    })
  }
  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }
  get type() {
    return this.addForm.get('type')
  }
  get category() {
    return this.addForm.get('category')
  }

  submitForm() {
    this.devicesService.CreateDevice(this.device).subscribe((res) => {
      console.log('Device added!')
      this.logService.CreateLog({
        message: 'Added device: ' + this.addForm.value,
        category: 'Info',
        component: 'AddDevice',
      })
      this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
    })
  }
}
