import { Component, OnInit, NgZone } from '@angular/core'
import { DevicesService } from './../../services/devices.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LogService } from '../../services/log.service'

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  DeviceForm: FormGroup
  DeviceArr: any = []
  ngOnInit() {
    this.addDevice()
  }
  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public devicesService: DevicesService,
    private logService: LogService
  ) {}
  addDevice() {
    this.DeviceForm = this.fb.group({
      id: [''],
      name: [''],
      type: [''],
      category: [''],
    })
  }
  submitForm() {
    this.devicesService.CreateDevice(this.DeviceForm.value).subscribe((res) => {
      console.log('Device added!')
      this.logService.add({
        message: 'Added device: ' + this.DeviceForm.value,
        category: 'Info',
        component: 'AddDevice',
      })
      this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
    })
  }
}
