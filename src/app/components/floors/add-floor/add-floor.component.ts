import { CommonModule } from '@angular/common'
import { Component, NgZone, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'

import { FloorService } from '../../../services/floor.service'
import { LogService } from '../../../services/log.service'
import { Floor } from '../../../shared/floor'
import Validation from '../../../shared/validation'

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FloorAddComponent implements OnInit {
  floor: Floor
  isSubmitted = false
  valid: Validation = new Validation()
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
    throw new Error('Method not implemented.')
  }

  changeId(e: Event) {
    const value = (e.target as HTMLInputElement).value
    const objectId = value
    this._id?.setValue(objectId, { onlySelf: true })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDescription(i: number, e: Event) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.description.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeX(i: number, e: Event) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.x.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeY(i: number, e: Event) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.y.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeXpos(i: number, e: Event) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.xPos.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeYpos(i: number, e: Event) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.yPos.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeHpos(i: number, e: Event) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.hPos.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get _id() {
    return this.floorForm.get('_id')
  }

  get name() {
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

  get x() {
    return this.floorForm.get('dimension')?.get('x')
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
    return JSON.stringify(data, null, ' ')
  }

  get dimension() {
    return this.floorForm.get('dimension') as FormArray
  }

  addDimension() {
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
  }

  deleteDimension(i: number) {
    this.dimension.removeAt(i)
  }

  generateFloor() {
    this.floorForm.controls.name.setValue(faker.company.name() + ' - ' + faker.company.buzzPhrase())
    this.floorForm.controls.address.controls.street.setValue(
      faker.location.street() + ' ' + faker.location.buildingNumber(),
    )
    this.floorForm.controls.address.controls.city.setValue(faker.location.city())
    this.floorForm.controls.address.controls.country.setValue(faker.location.country())
    this.floorForm.controls.address.controls.postcode.setValue(faker.location.zipCode())
  }

  generateDimension(i: number) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.description.patchValue(faker.company.name() + ' - ' + faker.company.buzzPhrase(), {
        emitEvent: false,
        onlySelf: true,
      })
    this.floorForm.controls.dimension.at(i).controls.x.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.y.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.h.setValue(String(faker.number.int({ min: 2, max: 10 })))
    this.floorForm.controls.dimension.at(i).controls.xPos.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.yPos.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.hPos.setValue(String(faker.number.int({ min: 2, max: 100 })))
  }

  submitForm() {
    this.floorService.CreateFloor(this.floorForm.getRawValue() as Floor).subscribe(() => {
      console.log('Floor added!')
      this.logService.CreateLog({ operation: 'Create', component: 'Floor', message: this.floorForm.getRawValue() })
      this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
    })
  }
}
