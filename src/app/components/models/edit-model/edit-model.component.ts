import { Subscription } from 'rxjs'
import { LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { Model } from 'src/app/shared/model'

import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss'],
})
export class ModelEditComponent implements OnInit {
  attributeComponent: string = ''
  attributeComponentObject: string = ''
  inputId: string = ''
  model: Model
  component = ''
  submitted = false
  editModelForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modelsService: ModelsService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService,
  ) {}

  ngOnInit() {
    this.editModelForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(10)]],
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
        bottom: ['', null],
      }),
    })

    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.component = this.inputId
    this.getModel()
  }

  private getModel(): Subscription {
    return this.modelsService.GetModel(this.inputId.toString()).subscribe((data: Model) => {
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
          bottom: data.texture.bottom,
        },
      })
    })
  }

  onChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value
    console.log('Input value changed:', newValue)
  }

  get id() {
    return this.editModelForm.get('id') as FormControl
  }

  get name() {
    return this.editModelForm.get('name') as FormControl
  }

  deleteForm() {
    this.logService.CreateLog({
      objectId: this.editModelForm.value.id,
      operation: 'Delete',
      component: 'Model',
      message: { id: this.editModelForm.value },
    })
    this.modelsService.DeleteModel(this.inputId.toString()).subscribe(() => {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
    })
  }

  submitForm() {
    this.submitted = true
    if (this.editModelForm.valid && this.editModelForm.touched) {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      const log = {
        message: { model: this.editModelForm.value },
        operation: 'Update',
        component: 'Model',
        objectId: this.editModelForm.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        console.log('logService.CreateLog(log): ' + JSON.stringify(log))
      })
      this.modelsService
        .UpdateModel(this.inputId.toString(), this.editModelForm.value as unknown as Model)
        .subscribe(() => {
          this.router.navigate(['edit-model/', this.model.id])
        })
    }
  }
}
