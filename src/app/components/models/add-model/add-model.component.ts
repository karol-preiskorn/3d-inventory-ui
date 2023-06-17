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
  form = new FormGroup({
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
    this.form = this.formBulider.group({
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
    return this.form.get('id')
  }
  get name() {
    return this.form.get('name')
  }
  get width() {
    return this.form.get('width')
  }
  get height() {
    return this.form.get('height')
  }

  get type() {
    return this.form.get('type')
  }
  get category() {
    return this.form.get('category')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  submitForm() {
    this.modelsService.CreateModel(this.model).subscribe((res) => {
      console.log('Submit Model: ' + JSON.stringify(this.form.value))
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
function uuidv4(): any {
  throw new Error('Function not implemented.')
}

