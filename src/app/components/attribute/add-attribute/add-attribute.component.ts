import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { LogService } from 'src/app/services/log.service'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'

import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'

import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

import { Attribute } from 'src/app/shared/attribute'
import { AttributeService } from 'src/app/services/attribute.service'

import { Connection } from 'src/app/shared/connection'

import { Device } from 'src/app/shared/device'

import { Model } from 'src/app/shared/model'

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
    attributeTypeId: new FormControl(''),
    value: new FormControl('', [Validators.required])
  })

  attribute: Attribute
  deviceList: Device[]
  modelList: Model[]
  connectionList: Connection[]

  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent = 'Attribute'

  ngOnInit() {
    this.formAttribute()
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private attributeDictionaryService: AttributeDictionaryService,
    private attributeService: AttributeService,
    private logService: LogService
  ) { }
  formAttribute() {
    this.formAddAttribute = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      deviceId: [''],
      modelId: [''],
      connectionId: [''],
      attributeTypeId: ['', [Validators.required]],
      value: ['', [Validators.required]],
    })
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
  get value() {
    return this.formAddAttribute.get('value')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  submitForm() {
    this.attributeService.CreateAttribute(this.formAddAttribute.value as Attribute)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.formAddAttribute.get('id')?.value,
            message: this.toString(this.formAddAttribute.value),
            operation: 'Create',
            component: 'Attribute',
          }).subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
      })
  }
}
