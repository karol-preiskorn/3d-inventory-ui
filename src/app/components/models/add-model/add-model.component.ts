import {Component, NgZone, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {v4 as uuidv4} from 'uuid'

import {LogService} from 'src/app/services/log.service'
import {ModelsService} from 'src/app/services/models.service'
import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'
import {Model} from 'src/app/shared/model'

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
})
export class AddModelComponent implements OnInit {
  addModelForm: FormGroup
  model: Model
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()

  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public modelsService: ModelsService,
    private logService: LogService
  ) {}

  addDevice() {
    this.addModelForm = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      dimension: this.formBulider.group({
        width: ['1', [Validators.required]],
        height: ['1', [Validators.required]],
        depth: ['1', [Validators.required]],
      }),
      texture: this.formBulider.group({
        front: [''],
        back: [''],
        side: [''],
        top: [''],
        botom: [''],
      }),
      type: ['', [Validators.required]],
      category: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.addDevice()
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, {onlySelf: true})
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, {onlySelf: true})
  }

  changeDimension(e: any) {
    this.dimension?.setValue(e.target.value, {onlySelf: true})
  }
  changeWidth(e: any) {
    this.width?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeHeight(e: any) {
    this.height?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeDepth(e: any) {
    this.depth?.setValue(e.target.value as never, {onlySelf: true})
  }

  changeTexture(e: any) {
    this.texture?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeFront(e: any) {
    this.front?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeBack(e: any) {
    this.back?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeSide(e: any) {
    this.side?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeTop(e: any) {
    this.top?.setValue(e.target.value as never, {onlySelf: true})
  }
  changeBotom(e: any) {
    this.botom?.setValue(e.target.value as never, {onlySelf: true})
  }

  changeType(e: any) {
    this.type?.setValue(e.target.value, {onlySelf: true})
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, {onlySelf: true})
  }

  get id() {
    return this.addModelForm.get('id')
  }
  get name() {
    return this.addModelForm.get('name')
  }

  get dimension() {
    return this.addModelForm.get('dimension')
  }
  get width() {
    return this.addModelForm.get('width')
  }
  get height() {
    return this.addModelForm.get('height')
  }
  get depth() {
    return this.addModelForm.get('depth')
  }

  get texture() {
    return this.addModelForm.get('texture')
  }
  get front() {
    return this.addModelForm.get('front')
  }
  get back() {
    return this.addModelForm.get('back')
  }
  get side() {
    return this.addModelForm.get('side')
  }
  get top() {
    return this.addModelForm.get('top')
  }
  get botom() {
    return this.addModelForm.get('botom')
  }

  get type() {
    return this.addModelForm.get('type')
  }
  get category() {
    return this.addModelForm.get('category')
  }

  toString(data: any): string {
    return JSON.stringify(data)
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
