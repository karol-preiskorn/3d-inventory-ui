import { Component, NgZone, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { faker } from '@faker-js/faker'

import { FloorService } from '../../../services/floor.service'
import { LogIn, LogService } from '../../../services/log.service'
import { Floors, FloorDimension } from '../../../shared/floors'
import Validation from '../../../shared/validation'
import { LogComponent } from '../../log/log.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-edit-floor',
  templateUrl: './edit-floor.component.html',
  styleUrls: ['./edit-floor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, LogComponent],
})
export class FloorEditComponent implements OnInit {
  floor: Floors
  isSubmitted = false
  valid: Validation = new Validation()
  inputId = ''
  component = 'floors'
  componentName = 'Floor'
  attributeComponent = 'Device'
  attributeComponentObject: string = ''

  dimensionFormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(250)]),
    x: new FormControl('', [Validators.required, this.valid.numberValidator]),
    y: new FormControl('', [Validators.required, this.valid.numberValidator]),
    h: new FormControl('', [Validators.required, this.valid.numberValidator]),
    xPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    yPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    hPos: new FormControl('', [Validators.required, this.valid.numberValidator]),
  })

  floorForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(250)]),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', [Validators.required, Validators.minLength(4)]),
      postcode: new FormControl('', [Validators.required, Validators.minLength(5)]),
    }),
    dimension: new FormArray([this.dimensionFormGroup]),
  })

  constructor(
    private readonly formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public ReactiveFormsModule: ReactiveFormsModule,
    private readonly ngZone: NgZone,
    private readonly router: Router,
    private readonly floorService: FloorService,
    private readonly logService: LogService,
  ) {}

  ngOnInit() {
    console.log('--------------- Edit-Floor ----------------')
    const id: string = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.inputId = id
    this.component = this.inputId
    this.attributeComponent = 'Floor'
    this.floorService.getFloorSynchronize(id).subscribe((floor: Floors) => {
      this.floor = floor
      this.attributeComponentObject = JSON.stringify(this.floor)
      console.log('edit-device.attributeComponent = ' + this.attributeComponent)
      console.log('edit-device.attributeComponentObject = ' + this.attributeComponentObject)
      // TODO: one line mapping for this.floorForm.setValue(this.floor)
      console.log(this.floor.dimension.map((d: FloorDimension) => this.createDimensionGroup(d)))
      this.floorForm.controls.id.setValue(id)
      this.floorForm.controls.name.setValue(this.floor.name)
      this.floorForm.controls.address.controls.street.setValue(this.floor.address.street)
      this.floorForm.controls.address.controls.city.setValue(this.floor.address.city)
      this.floorForm.controls.address.controls.country.setValue(this.floor.address.country)
      this.floorForm.controls.address.controls.postcode.setValue(this.floor.address.postcode)
      this.floorForm.setControl(
        'dimension',
        new FormArray(this.floor.dimension.map((floor: FloorDimension) => this.createDimensionGroup(floor))),
      )
    })
  }
  createDimensionGroup(dimension: FloorDimension) {
    return new FormGroup({
      description: new FormControl(dimension.description, [Validators.required, Validators.minLength(4)]),
      x: new FormControl(dimension.x, [Validators.required, this.valid.numberValidator]),
      y: new FormControl(dimension.y, [Validators.required, this.valid.numberValidator]),
      h: new FormControl(dimension.h, [Validators.required, this.valid.numberValidator]),
      xPos: new FormControl(dimension.xPos, [Validators.required, this.valid.numberValidator]),
      yPos: new FormControl(dimension.yPos, [Validators.required, this.valid.numberValidator]),
      hPos: new FormControl(dimension.hPos, [Validators.required, this.valid.numberValidator]),
    })
  }

  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeStreet(e: Event) {
    this.street?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeCity(e: Event) {
    this.floorForm.controls.address.controls.city.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeCountry(e: Event) {
    this.floorForm.controls.address.controls.country.setValue((e.target as HTMLInputElement).value, {
      onlySelf: true,
    })
  }

  changePostcode(e: Event) {
    this.floorForm.controls.address.controls.postcode.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeX(e: Event) {
    this.floorForm.controls.dimension
      .at(0)
      .controls.x.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeH(e: Event) {
    this.floorForm.controls.dimension
      .at(0)
      .controls.h.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeXpos(e: Event) {
    this.floorForm.controls.dimension
      .at(0)
      .controls.xPos.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeHpos(e: Event) {
    this.floorForm.controls.dimension
      .at(0)
      .controls.hPos.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  get id() {
    return this.floorForm.get('id')
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
    return this.floorForm.controls.dimension.controls.values
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

  addFillDimension(floorDimension: FloorDimension) {
    const fg = new FormGroup({
      description: new FormControl(floorDimension.description, [Validators.required, Validators.minLength(4)]),
      x: new FormControl(floorDimension.x, [Validators.required, this.valid.numberValidator]),
      y: new FormControl(floorDimension.y, [Validators.required, this.valid.numberValidator]),
      h: new FormControl(floorDimension.h, [Validators.required, this.valid.numberValidator]),
      xPos: new FormControl(floorDimension.xPos, [Validators.required, this.valid.numberValidator]),
      yPos: new FormControl(floorDimension.yPos, [Validators.required, this.valid.numberValidator]),
      hPos: new FormControl(floorDimension.hPos, [Validators.required, this.valid.numberValidator]),
    })
    this.dimension.push(fg)
  }

  addAllFillDimensions() {}

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

  /**
   * Handles form submission for editing a floor.
   * Logs the update operation, sends the updated floor data to the service,
   * and navigates back to the floor list upon success.
   */
  submitForm() {
    this.isSubmitted = true
    if (this.floorForm.invalid) {
      return
    }
    const log: LogIn = {
      message: this.floorForm.value,
      operation: 'Update',
      component: 'floors',
      objectId: this.floorForm.value.id as string,
    }
    this.logService.CreateLog(log).subscribe(() => {})
    const id = this.floorForm.value.id || ''
    this.floorService.UpdateFloor(id, this.floorForm.getRawValue() as never).subscribe(() => {
      console.log('Floor updated!')
      this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
    })
  }
}
