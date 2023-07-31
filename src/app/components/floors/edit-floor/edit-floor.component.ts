import {Component, NgZone, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {FormArray} from '@angular/forms'
import {faker} from '@faker-js/faker'

import {LogService} from 'src/app/services/log.service'

import {Floor} from 'src/app/shared/floor'
import {FloorService} from 'src/app/services/floor.service'

import Validation from 'src/app/shared/validation'

@Component({
  selector: 'app-edit-floor',
  templateUrl: './edit-floor.component.html',
  styleUrls: ['./edit-floor.component.scss'],
})
export class EditFloorComponent implements OnInit {
  floor: Floor
  isSubmitted = false
  valid: Validation = new Validation()

  inputId = ''

  component = ''
  attributeComponent = 'Device'
  attributeComponentObject: string = ''

  dimensionFormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    x: new FormControl('', [Validators.required, this.valid.numberValidator]),
    y: new FormControl('', [Validators.required, this.valid.numberValidator]),
    h: new FormControl('', [Validators.required, this.valid.numberValidator]),
    x_pos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    y_pos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    h_pos: new FormControl('', [Validators.required, this.valid.numberValidator]),
  })

  floorForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(36)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    adress: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('Poland', [Validators.required, Validators.minLength(4)]),
      postcode: new FormControl('', [Validators.required, Validators.minLength(5)]),
    }),
    dimension: new FormArray([this.dimensionFormGroup]),
  })

  constructor(
    public activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
    private floorService: FloorService,
    private logService: LogService
  ) {}

  ngOnInit() {
    console.log('Floor!')
    const id: string = this.activatedRoute.snapshot.paramMap.get('id') || ''
    this.inputId = id
    this.component = this.inputId
    this.attributeComponent = 'Floor'
    this.floor = this.floorService.getFloorSynchronize(id)
    this.attributeComponentObject = JSON.stringify(this.floor)
    this.attributeComponentObject = JSON.stringify(this.floor)
    console.log('edit-device.attributeComponent = ' + this.attributeComponent)
    console.log('edit-device.attributeComponentObject = ' + this.attributeComponentObject)
    // @TODO one line mapping for this.floorForm.setValue(this.floor)
    this.floorForm.setValue(this.floor)
    // this.floorForm.controls.id.setValue(id)
    // this.floorForm.controls.name.setValue(this.floor.name)
    // this.floorForm.controls.adress.controls.street.setValue(this.floor.adress.street)
    // this.floorForm.controls.adress.controls.city.setValue(this.floor.adress.city)
    // this.floorForm.controls.adress.controls.country.setValue(this.floor.adress.country)
    // this.floorForm.controls.adress.controls.postcode.setValue(this.floor.adress.postcode)
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, {onlySelf: true})
  }

  changeName(e: any) {
    this.name?.setValue(e.target.value, {onlySelf: true})
  }

  changeDescription(e: any) {
    this.floorForm.controls.dimension.at(0).controls.description?.setValue(e.target.value, {onlySelf: true})
  }

  changeX(e: any) {
    this.floorForm.controls.dimension.at(0).controls.x.setValue(e.target.value, {onlySelf: true})
  }

  changeY(e: any) {
    this.floorForm.controls.dimension.at(0).controls.y.setValue(e.target.value, {onlySelf: true})
  }

  changeH(e: any) {
    this.floorForm.controls.dimension.at(0).controls.h.setValue(e.target.value, {onlySelf: true})
  }

  changeXpos(e: any) {
    this.floorForm.controls.dimension.at(0).controls.x_pos.setValue(e.target.value, {onlySelf: true})
  }

  changeYpos(e: any) {
    this.floorForm.controls.dimension.at(0).controls.y_pos.setValue(e.target.value, {onlySelf: true})
  }

  changeHpos(e: any) {
    this.floorForm.controls.dimension.at(0).controls.h_pos.setValue(e.target.value, {onlySelf: true})
  }

  get id() {
    return this.floorForm.get('id')
  }

  get name() {
    return this.floorForm.get('name')
  }

  get street() {
    return this.floorForm.get('adress')?.get('street')
  }

  get country() {
    return this.floorForm.get('adress')?.get('street')
  }

  get postcode() {
    return this.floorForm.get('adress')?.get('postcode')
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

  get x_pos() {
    return this.floorForm.get('dimension')?.get('x_pos')
  }

  get y_pos() {
    return this.floorForm.get('dimension')?.get('y_pos')
  }

  get h_pos() {
    return this.floorForm.get('dimension')?.get('h_pos')
  }

  toText(data: any): string {
    return JSON.stringify(data)
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
      x_pos: new FormControl('', [Validators.required, this.valid.numberValidator]),
      y_pos: new FormControl('', [Validators.required, this.valid.numberValidator]),
      h_pos: new FormControl('', [Validators.required, this.valid.numberValidator]),
    })
    this.dimension.push(fg)
  }

  deleteDimension(i: number) {
    this.dimension.removeAt(i)
  }

  generateFloor() {
    this.floorForm.controls.name.setValue(faker.company.name() + ' - ' + faker.company.bs())
    this.floorForm.controls.adress.controls.street.setValue(
      faker.location.street() + ' ' + faker.location.buildingNumber()
    )
    this.floorForm.controls.adress.controls.city.setValue(faker.location.city())
    this.floorForm.controls.adress.controls.country.setValue(faker.location.country())
    this.floorForm.controls.adress.controls.postcode.setValue(faker.location.zipCode())
  }

  generateDimension(i: number) {
    this.floorForm.controls.dimension
      .at(i)
      .controls.description.patchValue(faker.company.name() + ' - ' + faker.company.buzzPhrase(), {
        emitEvent: false,
        onlySelf: true,
      })
    this.floorForm.controls.dimension.at(i).controls.x.setValue(String(faker.number.int({min: 2, max: 100})))
    this.floorForm.controls.dimension.at(i).controls.y.setValue(String(faker.number.int({min: 2, max: 100})))
    this.floorForm.controls.dimension.at(i).controls.h.setValue(String(faker.number.int({min: 2, max: 10})))
    this.floorForm.controls.dimension.at(i).controls.x_pos.setValue(String(faker.number.int({min: 2, max: 100})))
    this.floorForm.controls.dimension.at(i).controls.y_pos.setValue(String(faker.number.int({min: 2, max: 100})))
    this.floorForm.controls.dimension.at(i).controls.h_pos.setValue(String(faker.number.int({min: 2, max: 100})))
  }

  submitForm() {
    this.floorService.UpdateFloor(this.floorForm.value.id, this.floorForm.getRawValue() as never).subscribe((res) => {
      console.log('Floor updated!')
      this.logService.CreateLog({
        object: this.floorForm.get('id')?.value,
        message: String(this.floorForm.value),
        operation: 'Update',
        component: 'Floor',
      })
      this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
    })
  }
}
