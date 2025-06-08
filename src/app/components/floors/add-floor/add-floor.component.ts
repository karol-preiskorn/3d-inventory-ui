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

  dimensionFormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    x: new FormControl('', [Validators.required, this.valid.numberValidator]),
    y: new FormControl('', [Validators.required, this.valid.numberValidator]),
    h: new FormControl('', [Validators.required, this.valid.numberValidator]),
    xPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    yPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    hPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
  })

  floorForm = new FormGroup({
    _id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('Poland', Validators.required),
      postcode: new FormControl('', Validators.required),
    }),
    dimension: new FormArray([this.dimensionFormGroup]),
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
    const dimensionArray = this.floorForm.get('dimension')
    if (dimensionArray && Array.isArray((dimensionArray as any).controls)) {
      return (dimensionArray as any).controls[index].get(controlName)
    }
    return null
  }
  // Add this method to your component class
  isControlValid(arrayName: string, index: number, controlName: string): boolean {
    const array = this.floorForm.get(arrayName) as FormArray
    if (array && Array.isArray(array.controls)) {
      const group = array.at(index) as FormGroup
      if (group && group.controls && group.controls[controlName]) {
        return group.controls[controlName].valid
      }
    }
    return false
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
    this.floorForm.get('name')?.setValue(faker.company.name() + ' - ' + faker.company.buzzPhrase())
    this.floorForm.get('address.street')?.setValue(faker.location.street() + ' ' + faker.location.buildingNumber())
    this.floorForm.get('address.city')?.setValue(faker.location.city())
    this.floorForm.get('address.country')?.setValue(faker.location.country())
    this.floorForm.get('address.postcode')?.setValue(faker.location.zipCode())
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
          component: 'Floor',
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
