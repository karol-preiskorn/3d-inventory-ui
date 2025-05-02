import { Observable, tap } from 'rxjs';

import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { LogService } from '../../../services/log.service'
import { AttributeDictionary } from '../../../shared/attribute-dictionary'
import { ComponentDictionary } from '../../../shared/component-dictionary'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/deviceTypes'
import { LogComponent } from '../../log/log.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-edit-attribute-dictionary',
  templateUrl: './edit-attribute-dictionary.component.html',
  styleUrls: ['./edit-attribute-dictionary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LogComponent],
})
export class AttributeDictionaryEditComponent implements OnInit {
  inputId: string
  form: FormGroup
  attributeDictionary: AttributeDictionary
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  typeDictionary: TypeDictionary = new TypeDictionary()
  logComponent: string

  ngOnInit() {
    this.formAttributeDictionary()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.getAttributeDictionary(this.inputId).subscribe((data: AttributeDictionary) => {
      //console.log('+++GetAttributeDictionary(' + this.inputId + ') => ' + JSON.stringify(data, null, 2))
      this.attributeDictionary = data
      if (this.form) {
        this.form.patchValue({
          _id: this.attributeDictionary._id,
          component: this.attributeDictionary.component,
          type: this.attributeDictionary.type,
          name: this.attributeDictionary.name,
          units: this.attributeDictionary.units,
        })
      }
    })
    this.logComponent = this.inputId
  }

  formAttributeDictionary() {
    this.form = this.formBuilder.group({
      _id: new FormControl('', [Validators.required, Validators.minLength(24)]),
      component: ['', [Validators.required]],
      type: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      units: ['', [Validators.required]],
    })
  }

  private getInput() {
    return this.activatedRoute.snapshot.paramMap.get('_id')
  }

  private getAttributeDictionary(id: string): Observable<AttributeDictionary> {
    console.log('++GetAttributeDictionary(' + this.inputId + ') => ' + JSON.stringify(id, null, 2))
    return this.attributeDictionaryService.GetAttributeDictionary(id).pipe(
      tap((data: AttributeDictionary) => {
        //console.log('+GetAttributeDictionary(' + this.inputId + ') => ' + JSON.stringify(data, null, 2))
        this.attributeDictionary = data
        this.form.setValue({
          _id: data._id,
          component: data.component,
          type: data.type,
          name: data.name,
          units: data.units,
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
    this._id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeComponent(e: Event) {
    this.component?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeType(e: Event) {
    this.type?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeUnits(e: Event) {
    this.units?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get _id() {
    return this.form.get('_id')
  }

  get component() {
    return this.form.get('component')
  }

  get type() {
    return this.form.get('type')
  }

  get name() {
    return this.form.get('name')
  }

  get units() {
    return this.form.get('units')
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, ' ')
  }

  submitForm() {
    if (this.form.valid && this.form.touched) {
      this.attributeDictionaryService.UpdateAttributeDictionary(this.inputId, this.form.value as AttributeDictionary).subscribe(() => {
        console.log('form.submitForm(): ' + JSON.stringify(this.form.value, null, 2))
        this.logService
          .CreateLog({
            objectId: this.form.get('_id')?.value,
            message: this.form.value,
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
}
