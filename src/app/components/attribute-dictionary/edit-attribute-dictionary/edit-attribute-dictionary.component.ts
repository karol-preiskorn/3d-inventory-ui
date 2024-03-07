
import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, tap } from 'rxjs'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'

@Component({
  selector: 'app-edit-attribute-dictionary',
  templateUrl: './edit-attribute-dictionary.component.html',
  styleUrls: ['./edit-attribute-dictionary.component.scss']
})
export class AttributeDictionaryEditComponent implements OnInit {
  inputId: string
  form: FormGroup // Specify the type as FormGroup
  attributeDictionary: AttributeDictionary
  isSubmitted = false;
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict();
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict();
  componentDictionary: ComponentDictionary = new ComponentDictionary();
  logComponent = '';
  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')!
    this.getAttributeDictionary(this.inputId).subscribe((data: AttributeDictionary) => {
      this.attributeDictionary = data
    })
    this.logComponent = this.inputId
    this.formAttributeDictionary()
  }
  editAttributeDictionaryForm = new FormGroup({
    _id: new FormControl('', [Validators.required, Validators.minLength(24)]),
    objectId: new FormControl('', [Validators.required, Validators.minLength(10)]),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    component: new FormControl('', Validators.required),
  })
  formAttributeDictionary() {
    this.editAttributeDictionaryForm = this.formBuilder.group({
      _id: new FormControl('', [Validators.required, Validators.minLength(24)]),
      objectId: ['', [Validators.required, Validators.minLength(24)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      component: ['', [Validators.required]],
    })
  }
  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('id')
  }
  private getAttributeDictionary(id: string | null): Observable<AttributeDictionary> {
    return this.attributeDictionaryService
      .GetAttributeDictionary(id)
      .pipe(
        tap((data: AttributeDictionary) => {
          console.log('GetAttributeDictionary(' + this.inputId + ') => ' + JSON.stringify(data, null, 2))
          this.attributeDictionary = data
          this.form.setValue({
            id: data._id,
            name: data.name,
            type: data.type,
            category: data.category,
            component: data.component,
          })
        })
      )
  }
  constructor(
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
  ) { }
  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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
  toString(data: unknown): string {
    return JSON.stringify(data, null, ' ')
  }
  submitForm() {
    this.attributeDictionaryService.UpdateAttributeDictionary(this.inputId, this.form.value as AttributeDictionary)
      .subscribe(() => {
        this.logService
          .CreateLog({
            objectId: this.form.get('id')?.value,
            message: this.toString(this.form.value),
            operation: 'Update',
            component: 'Attribute Dictionary',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
            this.router.navigate(['attribute-dictionary-list'])
          })
      })
  }
}
