import {Component, NgZone, OnInit} from '@angular/core'
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {Subscription} from 'rxjs'
import {LogIn, LogService} from 'src/app/services/log.service'
import {ModelsService} from 'src/app/services/models.service'
import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'
import {Model} from 'src/app/shared/model'

// interface editModelForm {
//   _id: FormControl<string | null>
//   name: FormControl<string | null>
//   dimension: {
//     width: FormControl<string>
//     height: FormControl<string>
//     depth: FormControl<string>
//   }
//   texture: FormGroup<string>
//   type: FormControl<string>
//   category: FormControl<string>
// }

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss'],
})
export class ModelEditComponent implements OnInit {
  inputId: string = ''
  model: Model
  component = ''
  submitted = false
  editModelForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
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

  profileForm: FormGroup
  editModelFormBuilder: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modelsService: ModelsService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService
  ) {}

  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  isSubmitted = false

  ngOnInit() {
    this.editModelFormBuilder = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required, Validators.minLength(4)]],
      dimension: this.formBuilder.group({
        width: [
          '',
          [Validators.required, Validators.minLength(1), Validators.maxLength(6), Validators.pattern('^[0-9]*$')],
        ],
        height: [
          '',
          [Validators.required, Validators.minLength(1), Validators.maxLength(6), Validators.pattern('^[0-9]*$')],
        ],
        depth: [
          '',
          [Validators.required, Validators.minLength(1), Validators.maxLength(6), Validators.pattern('^[0-9]*$')],
        ],
      }),
      texture: this.formBuilder.group({
        front: ['', null],
        back: ['', null],
        side: ['', null],
        top: ['', null],
        botom: ['', null],
      }),
      type: ['', Validators.required],
      category: ['', Validators.required],
    })
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.component = this.inputId
    this.getModel()
  }

  /**
   * Retrieves a model with the specified ID from the models service.
   * @param id - The ID of the model to retrieve.
   * @returns An Observable that emits the retrieved model.
   */
  private getModel(): Subscription {
    return this.modelsService.GetModel(this.inputId.toString()).subscribe((data: Model) => {
      console.log('GetModel ' + JSON.stringify(data, null, ' '))
      this.model = data
      this.editModelForm.setValue({
        id: data._id,
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

  onChange(event: Event) {
    // Get the new input value
    const newValue = (event.target as HTMLInputElement).value
    // Perform actions based on the new value
    console.log('Input value changed:', newValue)
  }

  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeWidth(e: Event) {
    (this.f['dimension'] as FormGroup).controls['width'].setValue((e.target as HTMLInputElement).value, {
      onlySelf: true,
    })
  }
  changeType(e: Event) {
    this.type?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeCategory(e: Event) {
    this.category?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
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

  get f(): {[key: string]: AbstractControl} {
    return this.editModelForm.controls
  }

  /**
   * Deletes the form data and performs the delete operation for the model.
   */
  DeleteForm() {
    this.logService.CreateLog({
      objectId: this.editModelForm.value.id,
      operation: 'Delete',
      component: 'Model',
      message: {id: this.editModelForm.value},
    })
    this.modelsService.DeleteModel(this.inputId.toString()).subscribe(() => {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
    })
  }
  /**
   * Submits the form for editing a model.
   * If the form is valid and has been touched, it updates the model, creates a log entry, and navigates to the models list.
   */
  submitForm() {
    this.submitted = true

    if (this.editModelForm.valid && this.editModelForm.touched) {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      const log: LogIn = {
        message: {model: this.editModelForm.value},
        operation: 'Update',
        component: 'Model',
        objectId: this.editModelForm.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        console.log(JSON.stringify(log))
      })
      this.modelsService
        .UpdateModel(this.inputId.toString(), this.editModelForm.value as unknown as Model)
        .subscribe(() => {
          this.router.navigate(['edit-model/', this.model._id])
        })
    }
  }
}
