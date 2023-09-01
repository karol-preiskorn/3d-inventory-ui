
import { Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { DeviceCategoryDict } from 'src/app/shared/deviceCategories'
import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { v4 as uuidv4 } from 'uuid'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-edit-attribute-dictionary',
  templateUrl: './edit-attribute-dictionary.component.html',
  styleUrls: ['./edit-attribute-dictionary.component.scss']
})
export class EditAttributeDictionaryComponent implements OnInit {
  inputId: any
  form: any
  attributeDictionary: AttributeDictionary
  isSubmitted = false
  deviceTypeDict: DeviceTypeDict = new DeviceTypeDict()
  deviceCategoryDict: DeviceCategoryDict = new DeviceCategoryDict()
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  logComponent = ''
  ngOnInit() {
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id')
    this.attributeDictionary = this.getAttributeDictionary(this.inputId)
    this.logComponent = this.inputId
    this.setAttributeDictionaryForm()
  }
  private getInput(){
    return this.activatedRoute.snapshot.paramMap.get('id')
  }
  private getAttributeDictionary(id: string): any {
    return this.attributeDictionaryService
      .GetAttributeDictionary(this.inputId)
      .subscribe((data: AttributeDictionary) => {
        console.log('GetAttributeDictionary(' + this.inputId + ') => ' + JSON.stringify(data, null, 2))
        this.attributeDictionary = data
        this.form.setValue({
          id: data.id,
          name: data.name,
          type: data.type,
          category: data.category,
          component: data.component,
        })
      })
  }
  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService
  ) {}

  setAttributeDictionaryForm() {
    this.form = this.formBulider.group({
      id: ['', [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      type: [null, [Validators.required]],
      category: [null, [Validators.required]],
      component: [null, [Validators.required]],
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
    return JSON.stringify(data, null, ' ')
  }
  submitForm() {
    this.attributeDictionaryService.UpdateAttributeDictionary(this.inputId, this.form.value as AttributeDictionary)
      .subscribe(() => {
        this.logService
          .CreateLog({
            object: this.form.get('id')?.value,
            message: this.toString(this.form.value),
            operation: 'Update',
            component: 'Attribute Dictionary',
          })
          .subscribe(() => {
            this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
            this.router.navigate(['attribute-dictionary-list'])
          })
    })
  }
}
