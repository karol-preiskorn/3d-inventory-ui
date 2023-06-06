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
  form  = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    component: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  attributeDictionary: AttributeDictionary
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
    this.form = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      component: ['', [Validators.required]],
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }
  changeComponent(e: any) {
    this.component?.setValue(e.target.value, { onlySelf: true })
  }
  get id() {
    return this.form.get('id')
  }
  get name() {
    return this.form.get('name')
  }
  get type() {
    return this.form.get('type')
  }
  get category() {
    return this.form.get('category')
  }
  get component() {
    return this.form.get('component')
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
