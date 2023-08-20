import { Component, NgZone, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'


import { LogService } from 'src/app/services/log.service'

import { Floor } from 'src/app/shared/floor'
import { FloorService } from 'src/app/services/floor.service'

import Validation from 'src/app/shared/validation'

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss'],
})
export class AddFloorComponent implements OnInit {
  floor: Floor
  isSubmitted = false
  valid: Validation = new Validation()

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
    id: new FormControl(uuidv4(), [Validators.required, Validators.minLength(36)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    adress: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('Poland', Validators.required),
      postcode: new FormControl('', Validators.required),
    }),
    dimension: new FormArray([this.dimensionFormGroup]),
  })

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private floorService: FloorService,
    private logService: LogService
  ) { }

  ngOnInit() {
    console.log('Floor!')
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }

  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }

  changeDescription(i: number, e: any) {
    this.floorForm.controls.dimension.at(i).controls.description.setValue(e.target.value, { onlySelf: true })
  }

  changeX(i: number,e: any) {
    this.floorForm.controls.dimension.at(i).controls.x.setValue(e.target.value, { onlySelf: true })
  }

  changeY(i: number,e: any) {
    this.floorForm.controls.dimension.at(i).controls.y.setValue(e.target.value, { onlySelf: true })
  }

  changeH(i: number,e: any) {
    this.floorForm.controls.dimension.at(i).controls.h.setValue(e.target.value, { onlySelf: true })
  }

  changeXpos(i: number,e: any) {
    this.floorForm.controls.dimension.at(i).controls.x_pos.setValue(e.target.value, { onlySelf: true })
  }

  changeYpos(i: number,e: any) {
    this.floorForm.controls.dimension.at(i).controls.y_pos.setValue(e.target.value, { onlySelf: true })
  }

  changeHpos(i: number,e: any) {
    this.floorForm.controls.dimension.at(i).controls.h_pos.setValue(e.target.value, { onlySelf: true })
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
    return JSON.stringify(data, null, ' ')
  }

  get dimension() {
    return this.floorForm.get('dimension') as FormArray
  }

  addDimension() {
    let fg = new FormGroup({
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
    this.floorForm.controls.adress.controls.street.setValue(faker.location.street() + ' ' + faker.location.buildingNumber())
    this.floorForm.controls.adress.controls.city.setValue(faker.location.city())
    this.floorForm.controls.adress.controls.country.setValue(faker.location.country())
    this.floorForm.controls.adress.controls.postcode.setValue(faker.location.zipCode())
  }

  generateDimension(i: number) {
    this.floorForm.controls.dimension.at(i).controls.description.patchValue(faker.company.name() + ' - ' + faker.company.buzzPhrase(), { emitEvent: false, onlySelf: true })
    this.floorForm.controls.dimension.at(i).controls.x.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.y.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.h.setValue(String(faker.number.int({ min: 2, max: 10 })))
    this.floorForm.controls.dimension.at(i).controls.x_pos.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.y_pos.setValue(String(faker.number.int({ min: 2, max: 100 })))
    this.floorForm.controls.dimension.at(i).controls.h_pos.setValue(String(faker.number.int({ min: 2, max: 100 })))
  }

  submitForm() {
    this.floorService.CreateFloor(this.floorForm.getRawValue() as Floor).subscribe((res) => {
      console.log('Floor added!')
      this.logService.CreateLog({
        operation: 'Create',
        component: 'Floor',
        message: this.toText(this.floorForm.getRawValue()),
      })
      this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
    })
  }
}
