import {Component, NgZone, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'

import {LogService} from 'src/app/services/log.service'
import {ComponentDictionary} from 'src/app/shared/component-dictionary'

import {AttributeDictionary} from 'src/app/shared/attribute-dictionary'
import {AttributeDictionaryService} from 'src/app/services/attribute-dictionary.service'

import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'

import {Attribute} from 'src/app/shared/attribute'
import {AttributeService} from 'src/app/services/attribute.service'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import {Connection} from 'src/app/shared/connection'
import {ConnectionService} from 'src/app/services/connection.service'

import {v4 as uuidv4} from 'uuid'
import {Subscription} from 'rxjs'
import {faker} from '@faker-js/faker'

import Validation from 'src/app/shared/validation'

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss'],
})
export class AddAttributeComponent implements OnInit {
  valid: Validation = new Validation()

  addAttributeFrom = new FormGroup(
    {
      id: new FormControl('', [Validators.required, Validators.minLength(36)]),
      deviceId: new FormControl('', this.valid.atLeastOneValidator),
      modelId: new FormControl('', this.valid.atLeastOneValidator),
      connectionId: new FormControl('', this.valid.atLeastOneValidator),
      attributeDictionaryId: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    },
    {validators: this.valid.atLeastOneValidator}
  )

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
  ) {}

  formAttribute() {
    this.addAttributeFrom = this.formBulider.group(
      {
        id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
        deviceId: [''],
        modelId: [''],
        connectionId: [''],
        attributeDictionaryId: ['', Validators.required],
        value: ['', Validators.required],
      },
      {validators: this.valid.atLeastOneValidator}
    )
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, {onlySelf: true})
  }

  changeDeviceId(e: any) {
    this.deviceId?.setValue(e.target.value, {onlySelf: true})
  }

  changeModelId(e: any) {
    this.modelId?.setValue(e.target.value, {onlySelf: true})
  }

  changeConnectionId(e: any) {
    this.connectionId?.setValue(e.target.value, {onlySelf: true})
  }

  changeAttributeDictionaryId(e: any) {
    this.attributeDictionaryId?.setValue(e.target.value, {onlySelf: true})
  }

  changeValue(e: any) {
    this.value?.setValue(e.target.value, {onlySelf: true})
  }

  get id() {
    return this.addAttributeFrom.get('id')
  }

  get deviceId() {
    return this.addAttributeFrom.get('deviceId')
  }

  get modelId() {
    return this.addAttributeFrom.get('modelId')
  }

  get connectionId() {
    return this.addAttributeFrom.get('connectionId')
  }

  get attributeDictionaryId() {
    return this.addAttributeFrom.get('attributeDictionaryId')
  }

  get value() {
    return this.addAttributeFrom.get('value')
  }

  toString(data: any): string {
    return JSON.stringify(data)
  }

  getDeviceList(): Subscription {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }

  getModelList(): Subscription {
    return this.modelService.GetModels().subscribe((data: any) => {
      const tmp = new Model()
      data.unshift(tmp)
      this.modelDictionary = data
    })
  }

  getConnectionList(): Subscription {
    return this.connectionService.GetConnections().subscribe((data: any) => {
      const tmp = new Connection()
      data.unshift(tmp)
      this.connectionDictionary = data
    })
  }

  getAttributeDictionaryList(): Subscription {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: any) => {
      this.attributeDictionary = data
    })
  }

  /**
   * @description Generate random data for attribute
   *              1. Select one of List
   *                  - deviceId: [''],
   *                  - modelId: [''],
   *                  - connectionId: [''],
   *              2. get random data from this list
   *              3. get random data from attributeDictionaryId: ['', Validators.required],
   *              4. set random value: ['', Validators.required],
   * @memberof AddAttributeComponent
   */
  generateAttributeDictionary() {
    this.addAttributeFrom.controls.value.setValue(faker.company.name() + ' - ' + faker.company.bs())
  }

  submitForm(): void {
    this.attributeService.CreateAttribute(this.addAttributeFrom.value as Attribute).subscribe(() => {
      this.logService
        .CreateLog({
          object: this.addAttributeFrom.get('id')?.value,
          message: this.toString(this.addAttributeFrom.value),
          operation: 'Create',
          component: 'Attributes',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
        })
    })
  }
}
