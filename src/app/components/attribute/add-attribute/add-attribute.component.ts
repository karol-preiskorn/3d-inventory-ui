import { Subscription, take } from 'rxjs'

import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'

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
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AttributeAddComponent implements OnInit {
  valid: Validation = new Validation()

  addAttributeForm!: FormGroup

  deviceDictionary: Device[]
  modelDictionary: Model[] = []
  connectionDictionary: Connection[] = []
  attributeDictionary: AttributesDictionary[] = []

  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component = 'attributes'

  // Add this property to enable debug mode (set to false by default)
  debugMode: boolean = false

  ngOnInit() {
    this.formAttribute()
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()
  }

  constructor(
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private attributeService: AttributeService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
  ) {}

  formAttribute() {
    this.addAttributeForm = this.formBuilder.group(
      {
        _id: [''],
        deviceId: [''],
        modelId: [''],
        connectionId: [''],
        attributeDictionaryId: ['', Validators.required],
        value: ['', Validators.required],
      },
      { validators: this.valid.atLeastOneValidator },
    )
  }

  changeId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    this._id?.setValue(value, { onlySelf: true })
  }

  changeModelId(e: Event) {
    this.modelId?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDeviceId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    this.deviceId?.setValue(value, { onlySelf: true })
  }

  changeConnectionId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    this.connectionId?.setValue(value, { onlySelf: true })
  }

  changeAttributeDictionaryId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    this.attributeDictionaryId?.setValue(value, { onlySelf: true })
  }

  changeValue(e: Event) {
    this.value?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get _id() {
    return this.addAttributeForm.get('_id')
  }

  get deviceId() {
    return this.addAttributeForm.get('deviceId')
  }

  get modelId() {
    return this.addAttributeForm.get('modelId')
  }

  get connectionId() {
    return this.addAttributeForm.get('connectionId')
  }

  get attributeDictionaryId() {
    return this.addAttributeForm.get('attributeDictionaryId')
  }

  get value() {
    return this.addAttributeForm.get('value')
  }

  toString(data: unknown): string {
    // Specify a more specific type for the 'data' parameter
    return JSON.stringify(data, null, 2)
  }

  getDeviceList(): Subscription {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }

  getModelList(): Subscription {
    return this.modelService.GetModels().subscribe((data: Model[]) => {
      const tmp = new Model()
      data.unshift(tmp)
      this.modelDictionary = data
    })
  }

  getConnectionList(): Subscription {
    return this.connectionService.GetConnections().subscribe((data: Connection[]) => {
      const tmp = new Connection()
      data.unshift(tmp)
      this.connectionDictionary = data
    })
  }

  getAttributeDictionaryList(): Subscription {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributesDictionary[]) => {
      this.attributeDictionary = data
    })
  }

  generateAttributeDictionary() {
    // Randomly select deviceId, modelId, connectionId, and attributeDictionaryId if available
    const getRandomId = (arr: any[]) =>
      arr && arr.length > 1 ? arr[Math.floor(Math.random() * (arr.length - 1)) + 1]._id : ''
    const getRandomAttrDictId = (arr: any[]) =>
      arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)]._id : ''

    const randomDeviceId = getRandomId(this.deviceDictionary)
    const randomModelId = getRandomId(this.modelDictionary)
    const randomConnectionId = getRandomId(this.connectionDictionary)
    const randomAttributeDictionaryId = getRandomAttrDictId(this.attributeDictionary)

    this.addAttributeForm.controls.deviceId.setValue(randomDeviceId)
    this.addAttributeForm.controls.modelId.setValue(randomModelId)
    this.addAttributeForm.controls.connectionId.setValue(randomConnectionId)
    this.addAttributeForm.controls.attributeDictionaryId.setValue(randomAttributeDictionaryId)
    this.addAttributeForm.controls.value.setValue(faker.company.name() + ' - ' + faker.company.buzzPhrase())
  }

  // Add this method to support trackBy in *ngFor for models
  trackModelObj(_index: number, item: any): any {
    return item._id
  }

  trackDeviceObj(index: number, deviceObj: any): any {
    return deviceObj?._id ?? index
  }

  trackConnectionObj(index: number, item: any): any {
    return item?._id
  }

  trackAttributeDictionaryObj(index: number, item: any): any {
    return item._id
  }

  submitForm(): void {
    this.isSubmitted = true
    if (this.addAttributeForm.invalid) {
      console.log(
        `submitForm: invalid: ${this.addAttributeForm.invalid}, value: ${this.addAttributeForm.value}, valid: ${this.addAttributeForm.valid}`,
      )
      return
    }
    this.attributeService
      .CreateAttribute(this.addAttributeForm.value as Attribute)
      .pipe(take(1))
      .subscribe((res) => {
        const insertedId = (res as any)._id
        console.log('Attribute response: ' + JSON.stringify(res, null, 2))
        this.isSubmitted = true
        console.log('Inserted ID: ' + insertedId)
        const formData = this.addAttributeForm.value
        formData._id = insertedId // Ensure the formData has the _id field set
        this.logService
          .CreateLog({
            objectId: insertedId,
            message: formData,
            operation: 'Create',
            component: this.component,
          })
          .pipe(take(1))
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
      })
  }
}
