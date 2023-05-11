import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
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
export class AddModelComponent implements OnInit {
  addForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dimension: new FormGroup({
      width: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      height: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      depth: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
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
  ngOnInit() {
    this.addDevice()
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public modelsService: ModelsService,
    private logService: LogService
  ) {}

  addDevice() {
    this.addForm = this.formBulider.group({
      id: [''],
      name: [''],
      dimension: this.formBulider.group({
        width: [''],
        height: [''],
        depth: [''],
      }),
      texture: this.formBulider.group({
        front: [''],
        back: [''],
        side: [''],
        top: [''],
        botom: [''],
      }),
      type: [''],
      category: [''],
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }
  get id() {
    return this.addForm.get('id')
  }
  get name() {
    return this.addForm.get('name')
  }
  get width() {
    return this.addForm.get('width')
  }
  get height() {
    return this.addForm.get('height')
  }

  get type() {
    return this.addForm.get('type')
  }
  get category() {
    return this.addForm.get('category')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  get f() {
    return this.addForm.controls
  }
  submitForm() {
    this.modelsService.CreateModel(this.model).subscribe((res) => {
      console.log('Submit Model: ' + JSON.stringify(res))
      this.logService
        .CreateLog({
          message: JSON.stringify(res),
          operation: 'Create',
          component: 'Model',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/models-list'))
        })
    })
  }
}
