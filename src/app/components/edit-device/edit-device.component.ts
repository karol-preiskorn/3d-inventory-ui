import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Device } from 'src/app/shared/device'
import { DevicesService } from './../../services/devices.service'
import { LogService } from './../../services/log.service'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
  DevicesList: any = []
  updateDeviceForm: FormGroup

  ngOnInit() {
    this.updateForm()
  }

  constructor(
    private actRoute: ActivatedRoute,
    public devicesService: DevicesService,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService
  ) {
    const id: string | null = this.actRoute.snapshot.paramMap.get('id')
    this.devicesService.GetDevice(id).subscribe((data: Device) => {
      this.updateDeviceForm = this.fb.group({
        id: [data.id],
        name: [data.name],
        type: [data.type],
        category: [data.category],
      })
    })
  }

  updateForm() {
    this.logService.add({
      message: 'Edit device: ' + this.actRoute.snapshot.paramMap.get('id'),
      category: 'Info',
      component: 'EditDeviceComponent.updateForm',
    })
    this.updateDeviceForm = this.fb.group({
      id: [''],
      name: [''],
      type: [''],
      category: [''],
    })
  }

  submitForm() {
    const id: string | null = this.actRoute.snapshot.paramMap.get('id')
    this.logService.add({
      message: 'Edit device: ' + this.actRoute.snapshot.paramMap.get('id'),
      category: 'Info',
      component: 'EditDeviceComponent.SubmitForm',
    })
    this.devicesService
      .UpdateDevice(id, this.updateDeviceForm.value)
      .subscribe((res) => {
        this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
      })
  }
}
