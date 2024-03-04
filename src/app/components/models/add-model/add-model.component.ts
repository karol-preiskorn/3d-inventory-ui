import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { v4 as uuidv4 } from 'uuid'

import { LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { Model } from 'src/app/shared/model'

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
})
export class ModelAddComponent implements OnInit {
  addModelForm = new FormGroup({
    id: new FormControl(uuidv4(), [Validators.required, Validators.minLength(4)]),
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
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()

  constructor(
    private ngZone: NgZone,
    private router: Router,
    public modelsService: ModelsService,
    private logService: LogService
  ) { }

  ngOnInit() {
    this.isSubmitted = false
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }

  changeWidth(e: any) {
    this.width?.setValue(e.target.value as never, { onlySelf: true })
  }
  changeHeight(e: any) {
    this.height?.setValue(e.target.value as never, { onlySelf: true })
  }
  changeDepth(e: any) {
    this.depth?.setValue(e.target.value as never, { onlySelf: true })
  }

  changeFront(e: any) {
    this.front?.setValue(e.target.value as never, { onlySelf: true })
  }
  changeBack(e: any) {
    this.back?.setValue(e.target.value as never, { onlySelf: true })
  }
  changeSide(e: any) {
    this.side?.setValue(e.target.value as never, { onlySelf: true })
  }
  changeTop(e: any) {
    this.top?.setValue(e.target.value as never, { onlySelf: true })
  }
  changeBotom(e: any) {
    this.botom?.setValue(e.target.value as never, { onlySelf: true })
  }

  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }

  get id() {
    return this.addModelForm.get('id')
  }
  get name() {
    return this.addModelForm.get('name')
  }

  get width() {
    return this.addModelForm.get('dimension.width')
  }
  get height() {
    return this.addModelForm.get('dimension.height')
  }
  get depth() {
    return this.addModelForm.get('dimension.depth')
  }

  get front() {
    return this.addModelForm.get('texture.front')
  }
  get back() {
    return this.addModelForm.get('texture.back')
  }
  get side() {
    return this.addModelForm.get('texture.side')
  }
  get top() {
    return this.addModelForm.get('texture.top')
  }
  get botom() {
    return this.addModelForm.get('texture.botom')
  }

  get type() {
    return this.addModelForm.get('type')
  }
  get category() {
    return this.addModelForm.get('category')
  }

  submitForm() {
    this.modelsService.CreateModel(this.model).subscribe((res) => {
      console.log('Submit Model: ' + JSON.stringify(this.addModelForm.value))
      this.logService
        .CreateLog({
          message: JSON.stringify(res),
          operation: 'Create',
          component: 'Models',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('models-list'))
        })
    })
  }
}
