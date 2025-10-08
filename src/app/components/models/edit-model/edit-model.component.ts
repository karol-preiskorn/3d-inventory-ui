import { Subscription } from 'rxjs'

import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { LogService } from '../../../services/log.service'
import { DebugService } from '../../../services/debug.service'
import { ModelsService } from '../../../services/models.service'
import { Model } from '../../../shared/model'
import { LogComponent } from '../../log/log.component' // Import the standalone app-log component

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelEditComponent implements OnInit {
  attributeComponent: string = ''
  attributeComponentObject: string = ''
  inputId: string
  model: Model
  component = 'models'
  componentName = 'Models'
  submitted = false
  editModelForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public modelsService: ModelsService,
    private ngZone: NgZone,
    private router: Router,
    private logService: LogService,
    private debugService: DebugService,
    private readonly cdr: ChangeDetectorRef,
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

    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.component = this.inputId.toString()
    this.getModel()
  }

  private getModel(): Subscription {
    return this.modelsService.GetModel(this.inputId).subscribe((data: Model) => {
      this.debugService.api('GET', `/models/${this.inputId}`, data)
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
      this.cdr.markForCheck()
    })
  }

  onChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value
    this.debugService.debug('Input value changed:', newValue)
  }

  get id() {
    return this.editModelForm.get('id') as FormControl
  }

  get name() {
    return this.editModelForm.get('name') as FormControl
  }

  deleteForm() {
    const { id, name } = this.editModelForm.value
    this.logService.CreateLog({
      objectId: id,
      operation: 'Delete',
      component: 'models',
      message: JSON.stringify({ id, name, action: 'Delete model from edit form' }),
    })
    this.modelsService.DeleteModel(this.inputId).subscribe(() => {
      this.cdr.markForCheck()
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
    })
  }

  submitForm() {
    this.submitted = true
    if (this.editModelForm.valid && this.editModelForm.touched) {
      this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      const { id, name } = this.editModelForm.value
      const log = {
        message: JSON.stringify({
          id,
          name,
          action: 'Update model'
        }),
        operation: 'Update',
        component: 'models',
        objectId: this.editModelForm.value.id,
      }
      this.logService.CreateLog(log).subscribe(() => {
        this.debugService.debug('Log created:', log)
      })
      this.modelsService
        .UpdateModel(this.inputId.toString(), this.editModelForm.value as unknown as Model)
        .subscribe(() => {
          this.cdr.markForCheck()
          this.router.navigate(['edit-model/', this.model._id])
        })
    }
  }
}
