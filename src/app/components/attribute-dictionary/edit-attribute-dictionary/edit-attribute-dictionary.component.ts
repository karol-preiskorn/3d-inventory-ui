import { Observable, tap } from 'rxjs'

import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { CommonModule } from '@angular/common'
import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { LogService } from '../../../services/log.service'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { ComponentDictionary } from '../../../shared/ComponentDictionary'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/DeviceTypes'
import { LogComponent } from '../../log/log.component'
import { UnitDictionary } from '../../../shared/UnitDictionary'

@Component({
  selector: 'app-edit-attribute-dictionary',
  templateUrl: './edit-attribute-dictionary.component.html',
  styleUrls: ['./edit-attribute-dictionary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LogComponent],
})
export class AttributeDictionaryEditComponent implements OnInit {
  inputId: string
  form: FormGroup // Specify the type as FormGroup
  attributeDictionary: AttributesDictionary
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  UnitDictionary: UnitDictionary = new UnitDictionary()
  componentValue: string

  ngOnInit() {
    this.inputId = this.getInput() ?? ''
    console.log('EditAttributeDictionaryComponent inputId: ' + this.inputId)
    this.getAttributeDictionary(this.inputId).subscribe((data: AttributesDictionary) => {
      this.attributeDictionary = data
    })
    this.componentValue = this.inputId
    this.form = this.formBuilder.group({
      id: [''],
      name: [''],
      type: [''],
      componentName: [''],
      unit: [''],
    })
    this.formAttributeDictionary()
  }

  editAttributeDictionaryForm: FormGroup

  formAttributeDictionary() {
    this.editAttributeDictionaryForm = this.formBuilder.group({
      _id: new FormControl('', [Validators.required, Validators.minLength(24)]),
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      type: ['', [Validators.required]],
      componentName: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    })
  }

  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('id')
  }

  private getAttributeDictionary(id: string): Observable<AttributesDictionary> {
    return this.attributeDictionaryService.GetAttributeDictionary(id).pipe(
      tap((data: AttributesDictionary) => {
        console.log(`GetAttributeDictionary(${id}) =>`, data)
        this.attributeDictionary = data
        // Use patchValue to avoid errors if form controls are missing
        this.editAttributeDictionaryForm.patchValue({
          _id: data._id,
          name: data.name,
          type: data.type,
          componentName: data.componentName,
          unit: data.unit,
        })
      }),
    )
  }

  constructor(
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
  ) {}

  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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

  get id() {
    return this.form.get('id')
  }

  get name() {
    return this.form.get('name')
  }

  get type() {
    return this.form.get('type')
  }

  get componentName() {
    return this.form.get('componentName')
  }

  get unit() {
    return this.form.get('unit')
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, ' ')
  }

  // Returns an array of invalid control names in the editAttributeDictionaryForm
  getInvalidControls(): string[] {
    const invalid = []
    const controls = this.editAttributeDictionaryForm?.controls
    if (controls) {
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name)
        }
      }
    }
    return invalid
  }

  submitForm() {
    this.attributeDictionaryService
      .UpdateAttributeDictionary(this.inputId, this.editAttributeDictionaryForm.value as AttributesDictionary)
      .subscribe({
        next: () => {
          this.logService
            .CreateLog({
              objectId: this.editAttributeDictionaryForm.get('id')?.value,
              message: this.editAttributeDictionaryForm.value,
              operation: 'Update',
              component: 'attributesDictionary',
            })
            .subscribe(() => {
              this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
              this.router.navigate(['attribute-dictionary-list'])
            })
        },
        error: (err) => {
          console.error('Error updating attribute dictionary:', err)
          // Optionally, display an error message to the user
        },
      })
  }
}
