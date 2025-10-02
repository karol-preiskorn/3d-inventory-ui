import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { CommonModule } from '@angular/common'
import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { AuthenticationService } from '../../../services/authentication.service'
import { LogService } from '../../../services/log.service'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { ComponentDictionary } from '../../../shared/ComponentDictionary'
import { DeviceCategoryDict } from '../../../shared/deviceCategories'
import { DeviceTypeDict } from '../../../shared/DeviceTypes'
import { UnitDictionary } from 'src/app/shared/UnitDictionary'

@Component({
  selector: 'app-add-attribute-dictionary',
  templateUrl: './add-attribute-dictionary.component.html',
  styleUrls: ['./add-attribute-dictionary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeDictionaryAddComponent implements OnInit {
  addAttributeDictionaryForm: FormGroup<{
    name: FormControl<string | null>
    componentName: FormControl<string | null>
    unit: FormControl<string | null>
    type: FormControl<string | null>
    description: FormControl<string | null>
  }>
  attributeDictionary: AttributesDictionary
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  unitDictionary: UnitDictionary = new UnitDictionary()
  logComponent = 'AttributeDictionary'

  ngOnInit() {
    this.formAttributeDictionary()
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.warn('User is not authenticated, redirecting to login')
      this.router.navigate(['/login'])
    }
  }

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
    public authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
  ) {}

  formAttributeDictionary() {
    this.addAttributeDictionaryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      componentName: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeType(e: Event) {
    this.type?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeComponentName(e: Event) {
    this.componentName?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeUnit(e: Event) {
    this.unit?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDescription(e: Event) {
    this.description?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get name() {
    return this.addAttributeDictionaryForm.get('name')
  }

  get type() {
    return this.addAttributeDictionaryForm.get('type')
  }

  get componentName() {
    return this.addAttributeDictionaryForm.get('componentName')
  }
  get unit() {
    return this.addAttributeDictionaryForm.get('unit')
  }

  get id() {
    return this.addAttributeDictionaryForm.get('_id')
  }

  get description() {
    return this.addAttributeDictionaryForm.get('description')
  }

  get isFormInvalid(): boolean {
    return this.addAttributeDictionaryForm?.invalid
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }

  submitForm() {
    // Check authentication before submitting
    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated - redirecting to login')
      this.router.navigate(['/login'])
      return
    }

    // Debug authentication state
    const token = this.authService.getCurrentToken()
    console.warn('Authentication state:', {
      isAuthenticated: this.authService.isAuthenticated(),
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 20) + '...' || 'No token'
    })

    this.attributeDictionaryService
      .CreateAttributeDictionary(this.addAttributeDictionaryForm.value as unknown as AttributesDictionary)
      .subscribe({
        next: (createdAttribute) => {
          console.warn('Successfully created attribute dictionary:', createdAttribute)
          const _id = createdAttribute._id
          this.logService
            .CreateLog({
              objectId: _id,
              message: this.addAttributeDictionaryForm.getRawValue(),
              operation: 'Create',
              component: 'attributesDictionaries',
            })
            .subscribe(() => {
              this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
              this.router.navigate(['attribute-dictionary-list'])
            })
        },
        error: (error) => {
          console.error('Error creating attribute dictionary:', error)

          // Handle specific authentication errors
          if (error.message && error.message.includes('401')) {
            console.error('Authentication failed. Session may have expired. Redirecting to login...')
            this.router.navigate(['/login'])
          } else {
            console.error('Failed to create attribute dictionary:', error.message)
          }

          this.cdr.detectChanges()
        }
      })
  }
}
