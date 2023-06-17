import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { LogService } from 'src/app/services/log.service'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'

import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'

import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

import { Attribute } from 'src/app/shared/attribute'
import { AttributeService } from 'src/app/services/attribute.service'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { Model } from 'src/app/shared/model'
import { ModelsService } from 'src/app/services/models.service'

import { Connection } from 'src/app/shared/connection'
import { ConnectionService } from 'src/app/services/connection.service'

import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit {
  formAddAttribute = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(36)]),
    deviceId: new FormControl(''),
    modelId: new FormControl(''),
    connectionId: new FormControl(''),
    attributeDictionaryId: new FormControl(''),
    value: new FormControl('', [Validators.required])
  })

  attribute: Attribute
  deviceDictionary: Device[]
  modelDictionary: Model[]
  connectionDictionary: Connection[]
  attributeDictionary: AttributeDictionary[]

  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component = 'Attributes'

  ngOnInit() {
    this.formAttribute()
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private attributeService: AttributeService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService
  ) { }
  formAttribute() {
    this.formAddAttribute = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      deviceId: [''],
      modelId: [''],
      connectionId: [''],
      attributeDictionaryId: [''],
      value: ['', [Validators.required]],
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeDeviceId(e: any) {
    this.deviceId?.setValue(e.target.value, { onlySelf: true })
  }
  changeModelId(e: any) {
    this.modelId?.setValue(e.target.value, { onlySelf: true })
  }
  changeConnectionId(e: any) {
    this.connectionId?.setValue(e.target.value, { onlySelf: true })
  }
  changeAttributeDictionaryId(e: any) {
    this.attributeDictionaryId?.setValue(e.target.value, { onlySelf: true })
  }
  changeValue(e: any) {
    this.value?.setValue(e.target.value, { onlySelf: true })
  }
  get id() {
    return this.formAddAttribute.get('id')
  }
  get deviceId() {
    return this.formAddAttribute.get('deviceId')
  }
  get modelId() {
    return this.formAddAttribute.get('modelId')
  }
  get connectionId() {
    return this.formAddAttribute.get('connectionId')
  }
  get attributeDictionaryId() {
    return this.formAddAttribute.get('attributeDictionaryId')
  }
  get value() {
    return this.formAddAttribute.get('value')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      this.deviceDictionary = data
    })
  }
  getModelList() {
    return this.modelService.GetModels().subscribe((data: any) => {
      this.modelDictionary = data
    })
  }
  getConnectionList() {
    return this.connectionService.GetConnections().subscribe((data: any) => {
      this.connectionDictionary = data
    })
  }
  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: any) => {
      this.connectionDictionary = data
    })
  }
  submitForm() {
    this.attributeService.CreateAttribute(this.formAddAttribute.value as Attribute)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.formAddAttribute.get('id')?.value,
            message: this.toString(this.formAddAttribute.value),
            operation: 'Create',
            component: 'Attributes',
          }).subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
      })
  }
}
