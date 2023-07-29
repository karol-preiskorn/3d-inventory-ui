import {Component, NgZone, OnInit} from '@angular/core'
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {v4 as uuidv4} from 'uuid'

import {LogService} from 'src/app/services/log.service'

import {Floor} from 'src/app/shared/floor'
import {FloorService} from 'src/app/services/floor.service'

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
      country: new FormControl('Poland', Validators.required),
      postcode: new FormControl('', Validators.required),
    }),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dimension: new FormArray([this.dimensionFormGroup]),
  })

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private floorService: FloorService,
    private logService: LogService
  ) {}

  ngOnInit() {
    console.log('Floor!')
  }

  changeId(e: any) {
    this.id?.setValue(e.target.value, {onlySelf: true})
  }

  changeName(e: any) {
    this.name?.setValue(e.target.value, {onlySelf: true})
  }

  changeDescription(e: any) {
    this.description?.setValue(e.target.value, {onlySelf: true})
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
    this.dimension.push(this.dimensionFormGroup)
  }

  deleteDimension() {
    this.dimension.push(this.dimensionFormGroup)
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
