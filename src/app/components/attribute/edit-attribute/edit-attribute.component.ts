import {Component, NgZone, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'

import {LogService} from 'src/app/services/log.service'
import {ComponentDictionary} from 'src/app/shared/component-dictionary'

import {Attribute} from 'src/app/shared/attribute'
import {AttributeService} from 'src/app/services/attribute.service'

import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import {Connection} from 'src/app/shared/connection'
import {ConnectionService} from 'src/app/services/connection.service'

import {AttributeDictionary} from 'src/app/shared/attribute-dictionary'
import {AttributeDictionaryService} from 'src/app/services/attribute-dictionary.service'

import Validation from 'src/app/shared/validation'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {AbstractControl} from '@angular/forms'

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss'],
})
export class AttributeEditComponent implements OnInit {
  inputId: string
  valid: Validation = new Validation()

  editAttributeForm = new FormGroup(
    {
      _id: new FormControl('', [Validators.required]),
      deviceId: new FormControl(''),
      modelId: new FormControl(''),
      connectionId: new FormControl(''),
      attributeDictionaryId: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    },
    {validators: this.valid.atLeastOneValidator}
  )

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
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')!
    this.getAttribute(this.inputId).subscribe((data: Attribute) => {
      // Remove the argument from the subscribe function call
      this.attribute = data
      this.editAttributeForm.setValue(data)
    })
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()
    this.component = this.inputId
  }
  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('id')
  }
  private getAttribute(id: string): Observable<Attribute> {
    return this.attributeService.GetAttribute(id).pipe(
      tap((data: Attribute) => {
        console.log('AttributeEditComponent.GetAttribute(' + id + ') => ' + JSON.stringify(data, null, 2))
        this.attribute = data
        this.editAttributeForm.setValue(data)
      })
    )
  }
  constructor(
    public formBuilder: FormBuilder,
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

  changeModelId(e: Event) {
    this.modelId?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeDeviceId(e: Event) {
    this.deviceId?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeConnectionId(e: Event) {
    this.connectionId?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }

  value: AbstractControl | null = null

  changeAttributeDictionaryId(e: Event) {
    this.attributeDictionaryId?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }

  changeValue(e: Event) {
    this.value = this.editAttributeForm.get('value')
    this.value?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }

  get id() {
    return this.editAttributeForm.get('id')
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
  toString(data: unknown): string {
    return JSON.stringify(data, null, ' ')
  }
  getDeviceList() {
    this.deviceService.GetDevices().subscribe((data: Device[]) => {
      // Specify the type of 'data' as 'Device[]'
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }
  findDeviceName(id: string) {
    return this.deviceDictionary.find((e) => e._id === id)?.name
  }
  getModelList() {
    return this.modelService.GetModels().subscribe((data: Model[]) => {
      const tmp = new Model()
      data.unshift(tmp)
      this.modelDictionary = data
    })
  }
  getConnectionList() {
    return this.connectionService.GetConnections().subscribe((data: Connection[]) => {
      // Update the callback parameter type to Connection[]
      const tmp = new Connection()
      this.connectionDictionary = [tmp, ...data] // Spread the data array to include the existing tmp object
    })
  }
  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributeDictionary[]) => {
      // Update the callback parameter type to AttributeDictionary[]
      const tmp = new AttributeDictionary()
      this.attributeDictionary = [tmp, ...data] // Spread the data array to include the existing tmp object
    })
  }
  submitForm() {
    this.attributeService.UpdateAttribute(this.inputId, this.editAttributeForm.value as Attribute).subscribe(() => {
      this.logService
        .CreateLog({
          objectId: this.editAttributeForm.get('id')?.value,
          message: this.toString(this.editAttributeForm.value),
          operation: 'Update',
          component: 'Attributes',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
        })
    })
  }
}
