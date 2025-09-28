import { Component, Inject, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { CommonModule } from '@angular/common'
import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { LogService } from '../../../services/log.service'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { ComponentDictionary } from '../../../shared/ComponentDictionary'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/DeviceTypes'
import { UnitDictionary } from 'src/app/shared/UnitDictionary'

@Component({
  selector: 'app-add-attribute-dictionary',
  templateUrl: './add-attribute-dictionary.component.html',
  styleUrls: ['./add-attribute-dictionary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AttributeDictionaryAddComponent implements OnInit {
  addAttributeDictionaryForm: FormGroup<{
    name: FormControl<string | null>
    componentName: FormControl<string | null>
    unit: FormControl<string | null>
    type: FormControl<string | null>
    description: FormControl<string | null>
  }>
  attributeDictionary: AttributesDictionary
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  unitDictionary: UnitDictionary = new UnitDictionary()
  logComponent = 'AttributeDictionary'

  ngOnInit() {
    this.formAttributeDictionary()
  }

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
  ) {}

  formAttributeDictionary() {
    this.addAttributeDictionaryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      componentName: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeType(e: Event) {
    this.type?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeComponentName(e: Event) {
    this.componentName?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeUnit(e: Event) {
    this.unit?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDescription(e: Event) {
    this.description?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get name() {
    return this.addAttributeDictionaryForm.get('name')
  }

  get type() {
    return this.addAttributeDictionaryForm.get('type')
  }

  get componentName() {
    return this.addAttributeDictionaryForm.get('componentName')
  }
  get unit() {
    return this.addAttributeDictionaryForm.get('unit')
  }

  get id() {
    return this.addAttributeDictionaryForm.get('_id')
  }

  get description() {
    return this.addAttributeDictionaryForm.get('description')
  }

  get isFormInvalid(): boolean {
    return this.addAttributeDictionaryForm?.invalid
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }

  submitForm() {
    this.attributeDictionaryService
      .CreateAttributeDictionary(this.addAttributeDictionaryForm.value as unknown as AttributesDictionary)
      .subscribe((createdAttribute) => {
        const _id = createdAttribute._id
        this.logService
          .CreateLog({
            objectId: _id,
            message: this.addAttributeDictionaryForm.getRawValue(),
            operation: 'Create',
            component: 'attributesDictionary',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
            this.router.navigate(['attribute-dictionary-list'])
          })
      })
  }
}
