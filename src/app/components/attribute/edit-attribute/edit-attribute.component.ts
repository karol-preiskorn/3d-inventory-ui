
import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { LogService } from 'src/app/services/log.service'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'

import { Attribute } from 'src/app/shared/attribute'
import { AttributeService } from 'src/app/services/attribute.service'

import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { Model } from 'src/app/shared/model'
import { ModelsService } from 'src/app/services/models.service'

import { Connection } from 'src/app/shared/connection'
import { ConnectionService } from 'src/app/services/connection.service'

import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent implements OnInit {
  inputId: any

  formEditAttribute = new FormGroup({
    id: new FormControl('', [Validators.required]),
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

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()

  component = ''
  isSubmitted = false

  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.attribute = this.getAttribute(this.inputId)
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()
    this.component = this.inputId
  }
  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('id')
  }
  private getAttribute(id: string): any {
    return this.attributeService
      .GetAttribute(this.inputId)
      .subscribe((data: any) => {
        console.log('EditAttributeComponent.GetAttribute(' + this.inputId + ') => ' + JSON.stringify(data))
        this.attribute = data
        this.formEditAttribute.setValue(data)
      })
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
    return this.formEditAttribute.get('id')
  }
  get deviceId() {
    return this.formEditAttribute.get('deviceId')
  }
  get modelId() {
    return this.formEditAttribute.get('modelId')
  }
  get connectionId() {
    return this.formEditAttribute.get('connectionId')
  }
  get attributeDictionaryId() {
    return this.formEditAttribute.get('attributeDictionaryId')
  }
  get value() {
    return this.formEditAttribute.get('value')
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
      this.attributeDictionary = data
    })
  }
  submitForm() {
    this.attributeService.UpdateAttribute(this.inputId, this.formEditAttribute.value as Attribute)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.formEditAttribute.get('id')?.value,
            message: this.toString(this.formEditAttribute.value),
            operation: 'Update',
            component: 'Attributes',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
      })
  }
}
