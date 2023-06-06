
import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AttributeService } from 'src/app/services/attribute.service'
import { LogService } from 'src/app/services/log.service'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { Attribute } from 'src/app/shared/attribute'
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent implements OnInit {
  inputId: any
  form  = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    component: new FormControl('', [Validators.required, Validators.minLength(4)])
  })
  attribute: Attribute
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent: any
  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')?.toString
    this.attribute = this.getAttribute(this.inputId)
    this.logComponent = this.inputId
    this.setAttributeForm()
  }
  private getInput(){
    return this.activatedRoute.snapshot.paramMap.get('id')
  }
  private getAttribute(id: string): any {
    return this.attributeService
      .GetAttribute(this.inputId)
      .subscribe((data: Attribute) => {
        console.log('GetAttribute(' + this.inputId + ') => ' + JSON.stringify(data))
        this.attribute = data
        this.form.setValue({
          id: data.id,
          deviceId: data.deviceId,
          modelId: data.modelId,
          connectionId: data.connectionId,
          value: data.value,
        })
      })
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public attributeService: AttributeService,
    private logService: LogService
  ) {}

  setAttributeForm() {
    this.form = this.formBulider.group({
      id: ['', [Validators.required, Validators.minLength(36)]],
      deviceId: ['', [Validators.nullValidator]],
      modelId: [null, [Validators.nullValidator]],
      connectionId: [null, [Validators.nullValidator]],
      value: [null, [Validators.required]],
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
  changeComponent(e: any) {
    this.component?.setValue(e.target.value, { onlySelf: true })
  }
  get id() {
    return this.form.get('id')
  }
  get name() {
    return this.form.get('name')
  }
  get type() {
    return this.form.get('type')
  }
  get category() {
    return this.form.get('category')
  }
  get component() {
    return this.form.get('component')
  }
  toString(data: any): string {
    return JSON.stringify(data)
  }
  submitForm() {
    this.attributeService.UpdateAttribute(this.inputId, this.form.value as Attribute)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.form.get('id')?.value,
            message: this.toString(this.form.value),
            operation: 'Update',
            component: 'Attribute',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
          })
    })
  }
}
