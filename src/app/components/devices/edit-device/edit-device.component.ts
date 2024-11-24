import { lastValueFrom } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import {
    AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DeviceService } from '../../../services/device.service';
import { LogIn, LogService } from '../../../services/log.service';
import { ModelsService } from '../../../services/models.service';
import { Device } from '../../../shared/device';
import { Model } from '../../../shared/model';
import Validation from '../../../shared/validation';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class DeviceEditComponent implements OnInit {
  device: Device = new Device()
  modelList: Model[]
  valid: Validation = new Validation()
  editDeviceForm: FormGroup // Declare the editDeviceForm property

  // Arrow function for number validation
  numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: number = control.value as number
    if (Number.isNaN(value) || Number(value) > 100 || Number(value) < -100) {
      return { invalidNumber: true }
    }
    return null
  }

  createFormGroup = () => {
    return this.formBulider.group({
      _id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(4)]],
      modelId: ['', Validators.required],
      position: this.formBulider.group({
        x: [0, [Validators.required, this.numberValidator]],
        y: [0, [Validators.required, this.numberValidator]],
        h: [0, [Validators.required, this.numberValidator]],
      }),
    })
  }

  attributeComponent: string
  attributeComponentObject: string
  component: string

  constructor(
    private formBulider: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public devicesService: DeviceService,
    private router: Router,
    private logService: LogService,
    private modelsService: ModelsService,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.attributeComponent = 'device'
    this.component = id
    this.loadModels()

    if (id) {
      this.devicesService.getDeviceSynchronize(id).subscribe({
        next: (device: Device) => {
          this.device = device
        },
        error: (error) => {
          console.error('Error fetching device:', error)
        },
      })
    }
    this.editDeviceForm = this.createFormGroup() // Initialize the editDeviceForm property
    if (this.editDeviceForm) {
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
  }

  loadModels(): void {
    this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data
    })
  }
  async navigateToDeviceList() {
    await this.router.navigate(['device-list'])
  }

  async submitForm() {
    if (this.editDeviceForm.valid && this.editDeviceForm.touched) {
      console.log('DeviceEditComponent.submitForm(): ' + JSON.stringify(this.editDeviceForm.value, null, 2))
      const { _id } = this.editDeviceForm.value
      const log: LogIn = {
        message: this.editDeviceForm.value,
        operation: 'Update',
        component: 'Device',
        objectId: _id as string,
      }

      try {
        try {
          await lastValueFrom(this.logService.CreateLog(log))
        } catch (error) {
          console.error('Error creating log:', error)
        }

        try {
          await lastValueFrom(this.devicesService.UpdateDevice(this.editDeviceForm.value as unknown as Device))
        } catch (error) {
          console.error('Error update Device:', error)
        }

        await this.navigateToDeviceList()
      } catch (error) {
        console.error('Error during form submission:', error)
      }
    }
  }

  get name() {
    return this.editDeviceForm.get('name')
  }

  get modelId() {
    return this.editDeviceForm.get('modelId')
  }

  get x() {
    console.info('x:=' + this.editDeviceForm.controls.position.get('x'))
    return this.editDeviceForm.controls.position.get('x')
  }

  get y() {
    return this.editDeviceForm.controls.position.get('y')
  }

  get h() {
    return this.editDeviceForm.controls.position.get('h')
  }
}
