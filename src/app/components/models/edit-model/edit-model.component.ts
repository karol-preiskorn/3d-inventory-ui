import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LogIn, LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { Model } from 'src/app/shared/model'

interface ModelForm {
  id: FormControl<string | null>
  name: FormControl<string | null>
  dimension: {
    width: FormControl<string>
    height: FormControl<string>
    depth: FormControl<string>
  }
  texture: FormGroup<string>
  type: FormControl<string>
  category: FormControl<string>
}

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss'],
})
export class EditModelComponent implements OnInit {
  inputId: any
  model: Model
  component = ''

  editModelForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dimension: new FormGroup({
      width: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern("^[0-9]*$"),
      ]),
      height: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern("^[0-9]*$"),
      ]),
      depth: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern("^[0-9]*$"),
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

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  isSubmitted = false

  constructor(
    public activatedRoute: ActivatedRoute,
    public modelsService: ModelsService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService
  ) { }

  private getModel(id: string): any {
    return this.modelsService
      .GetModel(this.inputId)
      .subscribe((data: Model) => {
        console.log('GetModel ' + JSON.stringify(data, null, ' '))
        this.model = data
        this.editModelForm.setValue({
          id: data.id,
          name: data.name,
          dimension: {
            width: data.dimension.width.toString(),
            height: data.dimension.height.toString(),
            depth: data.dimension.depth.toString(),
          },
          texture: {
            front: data.texture.front,
            back: data.texture.back,
            side: data.texture.side,
            top: data.texture.top,
            botom: data.texture.botom,
          },
          type: data.type,
          category: data.category,
        })
      })
  }

  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.model = this.getModel(this.inputId)
    this.component = this.inputId
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
    return this.editModelForm.get('id')
  }
  get name() {
    return this.editModelForm.get('name')
  }
  get type() {
    return this.editModelForm.get('type')
  }
  get category() {
    return this.editModelForm.get('category')
  }
  toString(data: any): string {
    return JSON.stringify(data, null, ' ')
  }

  DeleteForm() {
    this.logService.CreateLog({
      object: this.editModelForm.value.id,
      operation: 'Delete',
      component: 'Models',
      message: JSON.stringify(this.editModelForm.value, null, 2),
    })
    this.modelsService.DeleteModel(this.inputId).subscribe(() => {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
    })
  }
  submitForm() {
    if (this.editModelForm.valid && this.editModelForm.touched) {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      const log: LogIn = {
        message: JSON.stringify(this.editModelForm.value, null, ' ') as string,
        operation: 'Update',
        component: 'Models',
        object: this.editModelForm.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        console.log(JSON.stringify(log))
      })
      this.modelsService
        .UpdateModel(this.inputId, this.editModelForm.value)
        .subscribe(() => {
          this.router.navigate(['edit-model/', this.model.id])
        })
    }
  }
}
