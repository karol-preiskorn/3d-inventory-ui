import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-add-attribute-dictionary',
  templateUrl: './add-attribute-dictionary.component.html',
  styleUrls: ['./add-attribute-dictionary.component.scss']
})
export class AttributeDictionaryAddComponent implements OnInit {

  addAttributeDictionaryForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(10)]),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    type: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    component: new FormControl(null, Validators.required),
  })

  attributeDictionary: AttributeDictionary
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent = 'AttributeDictionary'
  ngOnInit() {
    this.formAttributeDictionary()
  }

  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService
  ) { }

  formAttributeDictionary() {
    this.addAttributeDictionaryForm = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      type: [null, [Validators.required]],
      category: [null, [Validators.required]],
      component: [null, [Validators.required]],
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
    return this.addAttributeDictionaryForm.get('id')
  }

  get name() {
    return this.addAttributeDictionaryForm.get('name')
  }

  get type() {
    return this.addAttributeDictionaryForm.get('type')
  }

  get category() {
    return this.addAttributeDictionaryForm.get('category')
  }

  get component() {
    return this.addAttributeDictionaryForm.get('component')
  }

  toString(data: any): string {
    return JSON.stringify(data, null, 2)
  }

  submitForm() {
    this.attributeDictionaryService.CreateAttributeDictionary(this.addAttributeDictionaryForm.value as AttributeDictionary)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.addAttributeDictionaryForm.get('id')?.value,
            message: this.toString(this.addAttributeDictionaryForm.value),
            operation: 'Create',
            component: 'Attribute Dictionary',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
            this.router.navigate(['attribute-dictionary-list'])
          })
      })
  }
}
