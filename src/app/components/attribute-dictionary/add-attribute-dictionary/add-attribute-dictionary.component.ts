import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-add-attribute-dictionary',
  templateUrl: './add-attribute-dictionary.component.html',
  styleUrls: ['./add-attribute-dictionary.component.scss']
})

export class AddAttributeDictionaryComponent implements OnInit {
  addForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    component: new FormControl('', Validators.required),
  })
  attributeDictionary: AttributeDictionary
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  ngOnInit() {
    this.addAttributeDictionary()
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService
  ) {}

  addAttributeDictionary() {
    this.addForm = this.formBulider.group({
      id: [uuidv4()],
      name: [''],
      type: [''],
      category: [''],
      component: [''],
    })
  }
  changeId(e: any) {
    this.id?.setValue(e.target.value, { onlySelf: true })
  }
  changeName(e: any) {
    this.name?.setValue(e.target.value, { onlySelf: true })
  }
  changeType(e: any) {
    this.type?.setValue(e.target.value, { onlySelf: true })
  }
  changeCategory(e: any) {
    this.category?.setValue(e.target.value, { onlySelf: true })
  }
  get id() {
    return this.addForm.get('id')
  }
  get name() {
    return this.addForm.get('name')
  }

  get type() {
    return this.addForm.get('type')
  }
  get category() {
    return this.addForm.get('category')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  submitForm() {
    this.attributeDictionaryService.CreateAttributeDictionary(this.attributeDictionary).subscribe((res) => {
      console.log('Submit attribute dictionary: ' + JSON.stringify(res))
      this.logService
        .CreateLog({
          message: JSON.stringify(res),
          operation: 'Create',
          component: 'Attribute Dictionary',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/attribute-dictionary-list'))
        })
    })
  }
}
