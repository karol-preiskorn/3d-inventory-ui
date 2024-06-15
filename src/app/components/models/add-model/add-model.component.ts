import {LogService} from 'src/app/services/log.service'
import {ModelsService} from 'src/app/services/models.service'
import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'
import {Model} from 'src/app/shared/model'

import {Component, NgZone, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {faker} from '@faker-js/faker'

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
      width: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
      ]),
      height: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
      ]),
      depth: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
      ]),
    }),
    texture: new FormGroup({
      front: new FormControl('', null),
      back: new FormControl('', null),
      side: new FormControl('', null),
      top: new FormControl('', null),
      botom: new FormControl('', null),
    }),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
  })
  model: Model
  isSubmitted = false
  deviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict = new DeviceCategoryDict()

  constructor(
    private ngZone: NgZone,
    private router: Router,
    public modelsService: ModelsService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.model = new Model()
  }

  changeValue(controlName: string, value: string) {
    this.getControl(controlName).setValue(value, {onlySelf: true})
  }

  getControl(controlName: string) {
    return this.addModelForm.get(controlName)
  }

  generateModel() {
    if (this.addModelForm.controls.name) {
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
    if (this.addModelForm.controls.type) {
      this.addModelForm.controls.type.setValue(this.deviceTypeDict.getRandomName())
    }
    if (this.addModelForm.controls.category) {
      this.addModelForm.controls.category.setValue(this.deviceCategoryDict.getRandomName())
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
