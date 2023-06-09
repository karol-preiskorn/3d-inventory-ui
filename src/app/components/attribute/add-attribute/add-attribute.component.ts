import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { AttributeService } from 'src/app/services/attribute.service'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { Attribute } from 'src/app/shared/attribute'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit {
  formAddAttribute = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    component: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  attribute: Attribute
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
      value: ['', [Validators.required]],
    })
  }
  changeId(e: any) {
    this.attribute?.setValue(e.target.value, { onlySelf: true })
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
    this.attributeService.CreateAttribute(this.form.value as Attribute)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.form.get('id')?.value,
            message: this.toString(this.form.value),
            operation: 'Create',
            component: 'Attribute',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
      })
  }
}
