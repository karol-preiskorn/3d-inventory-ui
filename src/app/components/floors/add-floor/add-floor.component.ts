import { CommonModule } from '@angular/common'
import { Component, NgZone, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'

import { FloorService } from '../../../services/floor.service'
import { LogService } from '../../../services/log.service'
import { Floors } from '../../../shared/floors'
import Validation from '../../../shared/validation'

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
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
    _id: new FormControl('', [Validators.required]),
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
    private ngZone: NgZone,
    private router: Router,
    private floorService: FloorService,
    private logService: LogService,
  ) {}

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
    ;(this.dimension.at(i) as FormGroup)
      .get('description')
      ?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeX(i: number, e: Event) {
    ;(this.dimension.at(i) as FormGroup).get('x')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeY(i: number, e: Event) {
    ;(this.dimension.at(i) as FormGroup).get('y')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeXpos(i: number, e: Event) {
    ;(this.dimension.at(i) as FormGroup).get('xPos')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeYpos(i: number, e: Event) {
    ;(this.dimension.at(i) as FormGroup).get('yPos')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeHPos(i: number, e: Event) {
    ;(this.dimension.at(i) as FormGroup).get('hPos')?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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
      console.error('Error stringify data:', error)
      return '[Unable to display data]'
    }
  }

  get dimension() {
    return this.floorForm.get('dimension') as FormArray
  }

  // Add this method to your component class
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
      console.error('getDimension error:', error)
      return null
    }
  }
  // Add this method to your component class
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
      console.error('isControlValid error:', error)
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
      console.error('Error adding dimension:', error)
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
      console.log('The entire floor form is valid.')
    } else {
      console.log('The floor form is invalid:', this.floorForm.errors)
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
    console.log(`Dimension[${i}] description valid:`, isDescriptionValid)
    console.log(`Dimension[${i}] group valid:`, group.valid)
    console.log('Overall form valid:', this.floorForm.valid)
  }

  async onSubmit() {
    this.isSubmitted = true
    this.isSubmitDisabled = true // Disable the submit button

    if (this.floorForm.invalid) {
      console.error('Form is invalid:', this.floorForm.errors)
      return
    }

    try {
      const floorData: Floors = this.floorForm.value as Floors
      console.info('Floor Data to Submit:', JSON.stringify(floorData, null, ' '))

      // Create new floor
      await this.floorService.CreateFloor(floorData).toPromise()
      console.info('Floor created successfully')

      // Log the operation
      const logMessage = this.selectedFloor ? 'Updated Floor' : 'Created Floor'
      await this.logService
        .CreateLog({
          message: floorData,
          operation: logMessage,
          component: 'floors',
        })
        .toPromise()

      // Navigate back to the list or another page
      await this.router.navigateByUrl('floors-list')
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      this.isSubmitDisabled = false // Re-enable the submit button
    }
  }
}
