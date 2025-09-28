import { CommonModule } from '@angular/common'
import { Component, NgZone, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'
import { firstValueFrom } from 'rxjs'

import { FloorService } from '../../../services/floor.service'
import { LogService } from '../../../services/log.service'
import { Floors } from '../../../shared/floors'
import Validation from '../../../shared/validation'

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorAddComponent implements OnInit {
  floor: Floors
  isSubmitted = false
  valid: Validation = new Validation()
  selectedFloor: Floors | null = null
  showForm: boolean = true
  isSubmitDisabled: boolean = false // Add this property and initialize it as needed

  // Helper method to create a dimension FormGroup
  createDimensionGroup(): FormGroup {
    return new FormGroup({
      description: new FormControl('', [Validators.required, Validators.minLength(4)]),
      x: new FormControl('', [Validators.required, this.valid.numberValidator]),
      y: new FormControl('', [Validators.required, this.valid.numberValidator]),
      h: new FormControl('', [Validators.required, this.valid.numberValidator]),
      xPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
      yPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
      hPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    })
  }

  floorForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('Poland', Validators.required),
      postcode: new FormControl('', Validators.required),
    }),
    dimension: new FormArray([this.createDimensionGroup()]),
  })

  constructor(
    private router: Router,
    private floorService: FloorService,
    private logService: LogService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    // Initialization logic can go here if needed
  }

  get dimensionForms() {
    return this.floorForm.get('dimension') as import('@angular/forms').FormArray
  }

  changeId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    const objectId = value
    this._id?.setValue(objectId, { onlySelf: true })
  }

  changeName(e: Event) {
    this.floorForm.get('name')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDescription(i: number, e: Event) {
    ; (this.dimension.at(i) as FormGroup)
      .get('description')
      ?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeX(i: number, e: Event) {
    ; (this.dimension.at(i) as FormGroup).get('x')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeY(i: number, e: Event) {
    ; (this.dimension.at(i) as FormGroup).get('y')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeXpos(i: number, e: Event) {
    ; (this.dimension.at(i) as FormGroup).get('xPos')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeYpos(i: number, e: Event) {
    ; (this.dimension.at(i) as FormGroup).get('yPos')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeHPos(i: number, e: Event) {
    ; (this.dimension.at(i) as FormGroup).get('hPos')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get _id() {
    return this.floorForm.get('_id')
  }

  get nameControl() {
    return this.floorForm.get('name')
  }

  get street() {
    return this.floorForm.get('address')?.get('street')
  }

  get country() {
    return this.floorForm.get('address')?.get('street')
  }

  get postcode() {
    return this.floorForm.get('address')?.get('postcode')
  }

  get description() {
    return this.floorForm.get('description')
  }

  get y() {
    return this.floorForm.get('dimension')?.get('y')
  }

  get h() {
    return this.floorForm.get('dimension')?.get('h')
  }

  get xPos() {
    return this.floorForm.get('dimension')?.get('xPos')
  }

  get yPos() {
    return this.floorForm.get('dimension')?.get('yPos')
  }

  get hPos() {
    return this.floorForm.get('dimension')?.get('hPos')
  }

  toText(data: unknown): string {
    try {
      return JSON.stringify(data, null, ' ')
    } catch (error) {
      this.debugService.error('Error stringify data:', error)
      return '[Unable to display data]'
    }
  }

  get dimension() {
    return this.floorForm.get('dimension') as FormArray
  }

  getDimension(index: number, controlName: string) {
    try {
      const dimensionArray = this.floorForm.get('dimension')
      if (!(dimensionArray instanceof FormArray)) {
        throw new Error("'dimension' is not a FormArray")
      }
      const group = dimensionArray.at(index)
      if (!(group instanceof FormGroup)) {
        throw new Error(`No FormGroup at index ${index} in 'dimension'`)
      }
      const control = group.get(controlName)
      if (!control) {
        throw new Error(`Control '${controlName}' not found in group at index ${index}`)
      }
      return control
    } catch (error) {
      this.debugService.error('getDimension error:', error)
      return null
    }
  }

  isControlValid(arrayName: string, index: number, controlName: string): boolean {
    try {
      const array = this.floorForm.get(arrayName)
      if (!(array instanceof FormArray)) {
        throw new Error(`Form control '${arrayName}' is not a FormArray.`)
      }
      const group = array.at(index)
      if (!(group instanceof FormGroup)) {
        throw new Error(`No FormGroup at index ${index} in '${arrayName}'.`)
      }
      const control = group.get(controlName)
      if (!control) {
        throw new Error(`Control '${controlName}' not found in group at index ${index}.`)
      }
      return control.valid
    } catch (error) {
      this.debugService.error('isControlValid error:', error)
      return false
    }
  }

  addDimension() {
    try {
      const fg = new FormGroup({
        description: new FormControl('', [Validators.required, Validators.minLength(4)]),
        x: new FormControl('', [Validators.required, this.valid.numberValidator]),
        y: new FormControl('', [Validators.required, this.valid.numberValidator]),
        h: new FormControl('', [Validators.required, this.valid.numberValidator]),
        xPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
        yPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
        hPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
      })
      this.dimension.push(fg)
    } catch (error) {
      this.debugService.error('Error adding dimension:', error)
      // Optionally, show a user-friendly message or handle UI state
      // e.g., this.isSubmitDisabled = true;
    }
  }

  deleteDimension(i: number) {
    this.dimension.removeAt(i)
  }

  generateFloor() {
    this.floorForm.get('name')?.setValue(`${faker.company.name()} - ${faker.company.buzzPhrase()}`)
    this.floorForm.get('address.street')?.setValue(faker.location.street() + ' ' + faker.location.buildingNumber())
    this.floorForm.get('address.city')?.setValue(faker.location.city())
    this.floorForm.get('address.country')?.setValue(faker.location.country())
    this.floorForm.get('address.postcode')?.setValue(faker.location.zipCode())

    // Check validity after generating values
    this.floorForm.updateValueAndValidity()
    if (this.floorForm.valid) {
      this.debugService.debug('The entire floor form is valid.')
    } else {
      this.debugService.debug('The floor form is invalid:', this.floorForm.errors)
    }
  }

  generateDimension(i: number) {
    const group = this.dimension.at(i) as FormGroup
    group.get('description')?.patchValue(faker.company.name() + ' - ' + faker.company.buzzPhrase(), {
      emitEvent: false,
      onlySelf: true,
    })
    group.get('x')?.setValue(String(faker.number.int({ min: 2, max: 100 })))
    group.get('y')?.setValue(String(faker.number.int({ min: 2, max: 100 })))
    group.get('h')?.setValue(String(faker.number.int({ min: 2, max: 10 })))
    group.get('xPos')?.setValue(String(faker.number.int({ min: 2, max: 100 })))
    group.get('yPos')?.setValue(String(faker.number.int({ min: 2, max: 100 })))
    group.get('hPos')?.setValue(String(faker.number.int({ min: 2, max: 100 })))

    // Example usage: check if the 'description' control in the dimension array at index i is valid
    const isDescriptionValid = group.get('description')?.valid
    this.debugService.debug(`Dimension[${i}] description valid:`, isDescriptionValid)
    this.debugService.debug(`Dimension[${i}] group valid:`, group.valid)
    this.debugService.debug('Overall form valid:', this.floorForm.valid)
  }

  trackByFn(index: number, _item: unknown): number {
    return index
  }

  async onSubmit() {
    this.isSubmitted = true
    if (this.floorForm.invalid) {
      this.debugService.error('Form is invalid:', this.floorForm.errors)
      return
    }
    this.isSubmitDisabled = true
    try {
      const floorData: Floors = this.floorForm.value as Floors
      this.debugService.info('Floor Data to Submit:', JSON.stringify(floorData, null, ' '))
      const returnValue = await firstValueFrom(this.floorService.CreateFloor(floorData))
      this.debugService.info(`Floor created successfully:  ${returnValue._id}`)
      this.floorForm.get('_id')?.setValue(returnValue._id) // Ensure the form control is updated with the new ID
      this.floorForm.markAsPristine() // Mark the form as pristine after submission
      this.isSubmitDisabled = false // Re-enable the submit button
      this.debugService.info('Form submitted successfully:', this.floorForm.value)

      this.logService
        .CreateLog({
          objectId: returnValue._id,
          message: this.floorForm.value as Floors,
          operation: 'Create',
          component: 'floors',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
        })

      this.debugService.info('Log created successfully')
      this.router.navigateByUrl('floor-list')
      return
    } catch (error) {
      this.debugService.error('Error submitting form:', error)
      this.isSubmitDisabled = false
    }
  }
}
