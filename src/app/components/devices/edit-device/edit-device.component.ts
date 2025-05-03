import { lastValueFrom } from 'rxjs'

import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { DeviceService } from '../../../services/device.service'
import { LogIn, LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'
import Validation from '../../../shared/validation'
import { AttributeListComponent } from '../../attribute/attribute-list/attribute-list.component'
import { LogComponent } from '../../log/log.component'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, NgbPaginationModule, LogComponent, AttributeListComponent],
})
export class DeviceEditComponent implements OnInit {
  device: Device = new Device()
  modelList: Model[]
  valid: Validation = new Validation()
  editDeviceForm: FormGroup // Declare the editDeviceForm property

  // Arrow function for number validation
  numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: number = control.value as number
    if (isNaN(Number(value)) || Number(value) < 0) {
      return { invalidNumber: true }
    }
    return null
  }

  createFormGroup = () => {
    return new FormGroup({
      _id: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      modelId: new FormControl('', Validators.required),
      position: new FormGroup({
        x: new FormControl(0, [Validators.required, this.numberValidator]),
        y: new FormControl(0, [Validators.required, this.numberValidator]),
        h: new FormControl(0, [Validators.required, this.numberValidator]),
      }),
    })
  }

  attributeComponent: string
  attributeComponentObject: string
  component: string

  constructor(
    public activatedRoute: ActivatedRoute,
    public devicesService: DeviceService,
    private readonly router: Router,
    private readonly logService: LogService,
    private readonly modelsService: ModelsService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    // Initialize the form group first
    this.editDeviceForm = this.formBuilder.group({
      _id: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required, Validators.minLength(4)]],
      position: this.formBuilder.group({
        x: ['', [Validators.required, this.numberValidator]],
        y: ['', [Validators.required, this.numberValidator]],
        h: ['', [Validators.required, this.numberValidator]],
      }),
      modelId: ['', [Validators.required]],
    })

    const id = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
    this.attributeComponent = 'device'
    this.component = id
    this.loadModels()

    if (id) {
      this.devicesService.getDeviceSynchronize(id).subscribe({
        next: (device: Device) => {
          this.device = device

          // Patch the form only after it has been initialized
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
        },
        error: (error) => {
          console.error('Error fetching device:', error)
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

  get _id() {
    return this.editDeviceForm.get('_id')
  }

  get position() {
    return this.editDeviceForm.get('position')
  }

  get positionX() {
    return this.editDeviceForm.get('position.x')
  }

  get positionY() {
    return this.editDeviceForm.get('position.y')
  }

  get positionH() {
    return this.editDeviceForm.get('position.h')
  }

  get name() {
    return this.editDeviceForm.get('name')
  }

  get modelId() {
    return this.editDeviceForm.get('modelId')
  }

  get x() {
    return this.editDeviceForm.get('position.x')
  }

  get y() {
    return this.editDeviceForm.get('position.y')
  }

  get h() {
    return this.editDeviceForm.get('position.h')
  }
}
