
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
    value: new FormControl('', [Validators.required])
  })
  attribute: Attribute
  deviceDictionary: Device[]
  modelDictionary: Model[]
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component = ''
  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')?.toString
    this.attribute = this.getAttribute(this.inputId)
    this.component = this.inputId
  }
  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('id')
  }
  private getAttribute(id: string): any {
    return this.attributeService
      .GetAttribute(this.inputId)
      .subscribe((data: any) => {
        console.log('GetAttribute(' + this.inputId + ') => ' + JSON.stringify(data))
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
    private logService: LogService
  ) { }


  changeDeviceId(e: any) {
    this.deviceId?.setValue(e.target.value, { onlySelf: true })
  }
  changeModelId(e: any) {
    this.modelId?.setValue(e.target.value, { onlySelf: true })
  }
  // changeC(e: any) {
  //   this.connectionId?.setValue(e.target.value, { onlySelf: true })
  // }
  // changeValue(e: any) {
  //   this.value?.setValue(e.target.value, { onlySelf: true })
  // }
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
    return this.formEditAttribute.get('attributeDictioanryId')
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
  submitForm() {
    this.attributeService.UpdateAttribute(this.inputId, this.formEditAttribute.value as Attribute)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.formEditAttribute.get('id')?.value,
            message: this.toString(this.formEditAttribute.value),
            operation: 'Update',
            component: 'Attribute',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
      })
  }
}
