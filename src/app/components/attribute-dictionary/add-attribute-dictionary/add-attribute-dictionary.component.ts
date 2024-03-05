import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'

@Component({
  selector: 'app-add-attribute-dictionary',
  templateUrl: './add-attribute-dictionary.component.html',
  styleUrls: ['./add-attribute-dictionary.component.scss']
})
export class AttributeDictionaryAddComponent implements OnInit {

  addAttributeDictionaryForm = new FormGroup({
    _id: new FormControl('', [Validators.required, Validators.minLength(24)]),
    objectId: new FormControl('', [Validators.required, Validators.minLength(10)]),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    component: new FormControl('', Validators.required),
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
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService
  ) { }

  formAttributeDictionary() {
    this.addAttributeDictionaryForm = this.formBuilder.group({
      _id: new FormControl('', [Validators.required, Validators.minLength(24)]),
      objectId: ['', [Validators.required, Validators.minLength(24)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      component: ['', [Validators.required]],
    })
  }

  changeObjectId(e: Event) {
    this.objectId?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeType(e: Event) {
    this.type?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeCategory(e: Event) {
    this.category?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeComponent(e: Event) {
    this.component?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get objectId() {
    return this.addAttributeDictionaryForm.get('objectId')
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

  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }

  submitForm() {
    this.attributeDictionaryService.CreateAttributeDictionary(this.addAttributeDictionaryForm.value as AttributeDictionary)
      .subscribe(() => {
        this.logService
          .CreateLog({
            objectId: this.addAttributeDictionaryForm.get('id')?.value,
            message: this.toString(this.addAttributeDictionaryForm.getRawValue()),
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
