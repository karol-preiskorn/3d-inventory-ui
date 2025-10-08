import { environment } from 'src/environments/environment'

import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'

import { LogService } from '../../../services/log.service'
import { DebugService } from '../../../services/debug.service'
import { ModelsService } from '../../../services/models.service'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/DeviceTypes'
import { Model } from '../../../shared/model'

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelAddComponent implements OnInit {
  addModelForm: FormGroup
  model: Model
  isSubmitted = false
  deviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict = new DeviceCategoryDict()
  isSubmitDisabled: boolean = false
  isProduction: boolean = environment.production
  component = 'models'
  componentName = 'Models'

  constructor(
    private readonly ngZone: NgZone,
    private readonly router: Router,
    public modelsService: ModelsService,
    private readonly logService: LogService,
    private readonly formBuilder: FormBuilder,
    private readonly debugService: DebugService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.model = new Model()
    this.addModelForm = this.formBuilder.group({
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
        front: ['', [Validators.required, Validators.minLength(1)]],
        back: ['', [Validators.required, Validators.minLength(1)]],
        side: ['', [Validators.required, Validators.minLength(1)]],
        top: ['', [Validators.required, Validators.minLength(1)]],
        bottom: ['', [Validators.required, Validators.minLength(1)]],
      }),
    })
  }

  get textureGroup(): FormGroup {
    return this.addModelForm.get('texture') as FormGroup
  }

  isFieldInvalid(fieldPath: string): boolean {
    const control = this.addModelForm.get(fieldPath)
    return control ? control.invalid && (control.touched || control.dirty) : false
  }

  changeValue(controlName: string, value: string) {
    const control = this.getControl(controlName)
    if (control) {
      control.setValue(value, { onlySelf: true })
    }
  }

  getControl(controlName: string) {
    return this.addModelForm.get(controlName)
  }

  generateModel() {
    if (this.addModelForm.controls.name !== null && this.addModelForm.controls.name !== undefined) {
      this.addModelForm.controls.name.setValue(faker.company.name() + ' ' + faker.company.buzzPhrase())
    }
    const dimensionGroup = this.addModelForm.get('dimension') as FormGroup
    if (dimensionGroup?.get('depth')) {
      dimensionGroup.get('depth')?.setValue(faker.number.int(10).toString())
    }
    if (dimensionGroup?.get('height')) {
      dimensionGroup.get('height')?.setValue(faker.number.int(10).toString())
    }
    if (dimensionGroup?.get('width')) {
      dimensionGroup.controls['width'].setValue(faker.number.int(10).toString())
    }
    if (this.addModelForm.controls.type) {
      this.addModelForm.controls.type.setValue(this.deviceTypeDict.getRandomName())
    }
    if (this.addModelForm.controls.category) {
      this.addModelForm.controls.category.setValue(this.deviceCategoryDict.getRandomName())
    }
    this.cdr.markForCheck()
  }

  getFormValues(): string {
    return JSON.stringify(this.addModelForm.value, null, 2) // Pretty-print the form values
  }

  submitForm() {
    this.debugService.debug('Submit Model:', this.addModelForm.value)
    this.modelsService
      .CreateModel(this.addModelForm.value)
      .pipe()
      .subscribe((res) => {
        const response = res as { insertedId?: string; id?: string }
        this.logService
          .CreateLog({
            message: this.addModelForm.value,
            objectId: response.insertedId ? response.insertedId : response.id,
            operation: 'Create',
            component: this.component,
          })
          .subscribe(() => {
            this.cdr.markForCheck()
            this.ngZone.run(() => this.router.navigateByUrl('models-list'))
          })
      })
  }
}
