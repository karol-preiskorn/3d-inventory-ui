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

  editForm = new FormGroup({
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

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  isSubmitted = false

  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.model = this.getModel(this.inputId)
    this.component = this.inputId
  }

  private getModel(id: string): any {
    return this.modelsService
      .GetModel(this.inputId)
      .subscribe((data: Model) => {
        console.log('GetModel ' + JSON.stringify(data))
        this.model = data
        this.editForm.setValue({
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
  constructor(
    public activatedRoute: ActivatedRoute,
    public modelsService: ModelsService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService
  ) { }
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
    return this.editForm.get('id')
  }
  get name() {
    return this.editForm.get('name')
  }
  get type() {
    return this.editForm.get('type')
  }
  get category() {
    return this.editForm.get('category')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }

  DeleteForm() {
    this.logService.CreateLog({
      object: this.editForm.value.id,
      operation: 'Delete',
      component: 'Models',
      message: JSON.stringify(this.editForm.value, null, 2),
    })
    this.modelsService.DeleteModel(this.inputId).subscribe(() => {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
    })
  }
  submitForm() {
    if (this.editForm.valid && this.editForm.touched) {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      const log: LogIn = {
        message: JSON.stringify(this.editForm.value) as string,
        operation: 'Update',
        component: 'Models',
        object: this.editForm.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        console.log(JSON.stringify(log))
      })
      this.modelsService
        .UpdateModel(this.inputId, this.editForm.value)
        .subscribe(() => {
          this.router.navigate(['edit-model/', this.model.id])
        })
    }
  }
}
