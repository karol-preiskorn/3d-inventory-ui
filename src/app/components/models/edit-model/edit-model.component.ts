import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common'
import { Component, Input, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Model } from '../../../shared/model'
import { LogComponent } from '../../log/log.component' // Import the standalone app-log component

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss'],
  providers: [CommonModule, LogComponent],
  imports: [CommonModule, ReactiveFormsModule, LogComponent],
})
export class ModelEditComponent implements OnInit {
  attributeComponent: string = ''
  attributeComponentObject: string = ''
  inputId: string
  model: Model
  component = 'EditModel'
  submitted = false
  editModelForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modelsService: ModelsService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService,
  ) {
    this.editModelFormBulider()
  }

  ngOnInit() {
    this.editModelFormBulider()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.component = this.inputId.toString()
    this.getModel()
  }

  private editModelFormBulider() {
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
  }

  private getModel(): Subscription {
    return this.modelsService.GetModel(this.inputId).subscribe((data: Model) => {
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
    this.modelsService.DeleteModel(this.inputId).subscribe(() => {
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
          this.router.navigate(['edit-model/', this.model._id])
        })
    }
  }
}
