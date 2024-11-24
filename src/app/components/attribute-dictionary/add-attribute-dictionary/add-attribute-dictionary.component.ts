import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service';
import { LogService } from '../../../services/log.service';
import { AttributeDictionary } from '../../../shared/attribute-dictionary';
import { ComponentDictionary } from '../../../shared/attribute-dictionary-component';
import { TypeDictionary } from '../../../shared/attribute-dictionary-type';

@Component({
  selector: 'app-add-attribute-dictionary',
  templateUrl: './add-attribute-dictionary.component.html',
  styleUrls: ['./add-attribute-dictionary.component.scss'],
})
export class AttributeDictionaryAddComponent implements OnInit {
  addAttributeDictionaryForm: FormGroup<{
    component: FormControl<string | null>
    type: FormControl<string | null>
    name: FormControl<string | null>
    units: FormControl<string | null>
  }>
  attributeDictionary: AttributeDictionary
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  typeDictionary: TypeDictionary = new TypeDictionary()
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
      component: ['', [Validators.required]],
      type: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      units: ['', [Validators.required]],
    })
  }

  changeComponent(e: Event) {
    this.addAttributeDictionaryForm.get('component')?.setValue((e.target as HTMLSelectElement).value, { onlySelf: true })
  }

  changeType(e: Event) {
    this.addAttributeDictionaryForm.get('type')?.setValue((e.target as HTMLSelectElement).value, { onlySelf: true })
  }

  changeName(e: Event) {
    this.addAttributeDictionaryForm.get('name')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeUnits(e: Event) {
    this.addAttributeDictionaryForm.get('units')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get component() {
    return this.addAttributeDictionaryForm.get('component')
  }

  get type() {
    return this.addAttributeDictionaryForm.get('type')
  }

  get name() {
    return this.addAttributeDictionaryForm.get('name')
  }

  get units() {
    return this.addAttributeDictionaryForm.get('units')
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }

  submitForm() {
    this.attributeDictionaryService.CreateAttributeDictionary(this.addAttributeDictionaryForm.value as unknown as AttributeDictionary).subscribe(() => {
      this.logService
        .CreateLog({
          objectId: this.addAttributeDictionaryForm.get('id')?.value,
          message: this.addAttributeDictionaryForm.getRawValue(),
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
