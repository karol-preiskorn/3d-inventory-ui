import { Component, NgZone, OnInit } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { AttributeService } from '../../../services/attribute.service'
import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Attribute } from '../../../shared/attribute'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { ComponentDictionary } from '../../../shared/ComponentDictionary'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/DeviceTypes'
import { Model } from '../../../shared/model'
import Validation from '../../../shared/validation'
import { LogComponent } from '../../log/log.component'

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LogComponent],
})
export class AttributeEditComponent implements OnInit {
  inputId: string
  valid: Validation = new Validation()

  editAttributeForm: FormGroup

  attribute: Attribute
  deviceDictionary: Device[]
  modelDictionary: Model[]
  connectionDictionary: Connection[]
  attributeDictionary: AttributesDictionary[]

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()

  component: string
  isSubmitted = false

  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.getAttribute(this.inputId).subscribe((data: Attribute) => {
      this.attribute = data
      this.editAttributeForm.setValue({
        _id: data._id || '',
        attributeDictionaryId: data.attributeDictionaryId || '', // Default to an empty string
        connectionId: data.connectionId || '',
        deviceId: data.deviceId || '',
        modelId: data.modelId || '',
        value: data.value || '',
      })
    })
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()
    this.component = this.inputId
    this.getAttributeDictionaryList()
  }

  private getAttribute(id: string): Observable<Attribute> {
    return this.attributeService.GetAttribute(id).pipe(
      tap((data: Attribute) => {
        console.log('AttributeEditComponent.getAttribute(' + id + ') => ' + JSON.stringify(data, null, 2))
        this.attribute = data
        this.editAttributeForm.patchValue({
          _id: data._id,
          attributeDictionaryId: data.attributeDictionaryId,
          connectionId: data.connectionId,
          deviceId: data.deviceId,
          modelId: data.modelId,
          value: data.value,
        })
      }),
    )
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private attributeService: AttributeService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
    private ngZone: NgZone,
  ) {
    this.editAttributeForm = new FormGroup(
      {
        _id: new FormControl('', [Validators.required]),
        attributeDictionaryId: new FormControl('', [Validators.required]),
        connectionId: new FormControl(''),
        deviceId: new FormControl(''),
        modelId: new FormControl(''),
        value: new FormControl('', [Validators.required]),
      },
      { validators: this.atLeastOneValidator() },
    )
  }

  private atLeastOneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control as FormGroup
      const values = Object.values(formGroup.controls)
      const hasValue = values.some((control) => control.enabled && control.value !== null && control.value !== '')
      return hasValue ? null : { atLeastOne: true }
    }
  }

  changeModelId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    return value
  }

  changeDeviceId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    return value
  }

  changeConnectionId(e: Event) {
    this.connectionId?.setValue((e.target as HTMLSelectElement).value, { onlySelf: true })
  }

  changeAttributeDictionaryId(e: Event) {
    this.attributeDictionaryId?.setValue((e.target as HTMLSelectElement).value, { onlySelf: true })
  }

  onValueChange(e: Event) {
    const target = e.target
    if (target instanceof HTMLInputElement) {
      this.value?.setValue(target.value, { onlySelf: true })
    }
  }

  get id() {
    return this.editAttributeForm.get('_id')
  }

  get deviceId() {
    return this.editAttributeForm.get('deviceId')
  }

  get modelId() {
    return this.editAttributeForm.get('modelId')
  }

  get connectionId() {
    return this.editAttributeForm.get('connectionId')
  }

  get attributeDictionaryId() {
    return this.editAttributeForm.get('attributeDictionaryId')
  }

  get name() {
    return this.editAttributeForm.get('name')
  }

  get value() {
    return this.editAttributeForm.get('value')
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, ' ')
  }

  getDeviceList() {
    this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      this.deviceDictionary = [tmp, ...data]
    })
  }

  findDeviceName(id: string) {
    return this.deviceDictionary?.find((e) => e._id === id)?.name
  }

  getModelList(): void {
    this.modelService.GetModels().subscribe({
      next: (models: Model[]) => {
        this.modelDictionary = [new Model(), ...models]
      },
      error: (err) => {
        console.error('Error fetching models:', err)
        this.logService
          .CreateLog({
            objectId: '',
            message: { error: `Error fetching models: ${err?.message || err}` },
            operation: 'Fetch',
            component: 'models',
          })
          .subscribe()
      },
    })
  }

  getConnectionList() {
    this.connectionService.GetConnections().subscribe({
      next: (data: Connection[]) => {
        const placeholderConnection = new Connection()
        this.connectionDictionary = [placeholderConnection, ...data]
      },
      error: (error) => {
        console.error('Error fetching connections:', error)
        this.logService
          .CreateLog({
            objectId: '',
            message: { error: `Error fetching connections: ${error.message}` },
            operation: 'Fetch',
            component: 'connections',
          })
          .subscribe()
      },
    })
  }

  getAttributeDictionaryList() {
    this.attributeDictionaryService.GetAttributeDictionaries().subscribe({
      next: (data: AttributesDictionary[]) => {
        const placeholder = new AttributesDictionary()
        this.attributeDictionary = [placeholder, ...data]
      },
      error: (error) => {
        console.error('Error fetching attribute dictionaries:', error)
        this.logService
          .CreateLog({
            objectId: '',
            message: { error: `Error fetching attribute dictionaries: ${error.message}` },
            operation: 'Fetch',
            component: 'attributesDictionary',
          })
          .subscribe()
      },
    })
  }

  submitForm() {
    if (this.editAttributeForm.invalid) {
      this.editAttributeForm.markAllAsTouched()
      return
    }

    const attributeValue: Attribute = this.editAttributeForm.value as Attribute

    this.attributeService.UpdateAttribute(this.inputId, attributeValue).subscribe({
      next: () => {
        this.logService
          .CreateLog({
            objectId: attributeValue._id,
            message: attributeValue,
            operation: 'Update',
            component: 'attributes',
          })
          .subscribe({
            complete: () => {
              this.ngZone.run(() => {
                this.router.navigateByUrl('attribute-list')
              })
            },
          })
      },
      error: (error) => {
        console.error('Error updating attribute:', error)
        this.logService
          .CreateLog({
            objectId: attributeValue._id,
            message: { error: error.message },
            operation: 'Error',
            component: 'attributes',
          })
          .subscribe()
      },
    })
  }
}
