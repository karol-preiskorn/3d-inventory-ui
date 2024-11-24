import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faker } from '@faker-js/faker';

import { LogService } from '../../../services/log.service';
import { ModelsService } from '../../../services/models.service';
import { ComponentDictionary } from '../../../shared/attribute-dictionary-component';
import { TypeDictionary } from '../../../shared/attribute-dictionary-type';
import { Model } from '../../../shared/model';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
})
export class ModelAddComponent implements OnInit {
  addModelForm = new FormGroup({
    id: new FormControl('', null),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dimension: new FormGroup({
      width: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]),
      height: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]),
      depth: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]),
    }),
    texture: new FormGroup({
      front: new FormControl('', null),
      back: new FormControl('', null),
      side: new FormControl('', null),
      top: new FormControl('', null),
      bottom: new FormControl('', null),
    }),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
  })
  model: Model
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  typeDictionary: TypeDictionary = new TypeDictionary()

  constructor(
    private ngZone: NgZone,
    private router: Router,
    public modelsService: ModelsService,
    private logService: LogService,
  ) {}

  ngOnInit(): void {
    this.model = new Model()
  }

  changeValue(controlName: string, value: string) {
    const control = this.getControl(controlName)
    if (control) {
      control.setValue(value, { onlySelf: true })
    }
  }

  getControl(controlName: string) {
    return this.addModelForm.get(controlName)
  }

  generateModel() {
    if (this.addModelForm.controls.name !== null && this.addModelForm.controls.name !== undefined) {
      this.addModelForm.controls.name.setValue(faker.company.name() + ' ' + faker.company.buzzPhrase())
    }
    if (this.addModelForm.controls.dimension.controls.depth) {
      this.addModelForm.controls.dimension.controls.depth.setValue(faker.number.int(10).toString())
    }
    if (this.addModelForm.controls.dimension.controls.height) {
      this.addModelForm.controls.dimension.controls.height.setValue(faker.number.int(10).toString())
    }
    if (this.addModelForm.controls.dimension.controls.width) {
      this.addModelForm.controls.dimension.controls.width.setValue(faker.number.int(10).toString())
    }
  }

  submitForm() {
    console.log('Submit Model: ' + JSON.stringify(this.addModelForm.value))
    this.modelsService.CreateModel(this.model).subscribe((res) => {
      this.logService
        .CreateLog({
          message: this.addModelForm.value,
          objectId: res._id,
          operation: 'Create',
          component: 'Model',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('models-list'))
        })
    })
  }
}
