import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AttributeService } from 'src/app/services/attribute.service'
import { LogService } from 'src/app/services/log.service'
import { Attribute } from 'src/app/shared/attribute'

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
})
export class AttributeListComponent implements OnInit {
  attributeList: Attribute[] = []
  selectedAttribute: Attribute
  attributePage = 1
  component = 'Attribute List'

  ngOnInit() {
    this.LoadAttribute()
  }
  constructor(
    public attributeService: AttributeService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone
  ) { }
  LoadAttribute() {
    return this.attributeService
      .GetAttributes()
      .subscribe((data: any) => {
        this.attributeList = data
      })
  }
  DeleteAttribute(id: any) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: 'AttributeDictionary',
    })
    return this.attributeService
      .DeleteAttribute(id)
      .subscribe((data: any) => {
        console.log(data)
        this.LoadAttribute()
        this.router.navigate(['/attribute-dictionary-list'])
      })
  }
  async CloneAttribute(id: any) {
    const id_new: string =
      this.attributeService.CloneAttribute(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: 'Attributes',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('attributes-list'))
      })
  }
  AddAttribute() {
    this.router.navigateByUrl('add-attributes')
  }
  EditAttribute(attribute: Attribute) {
    this.selectedAttribute = attribute
    this.router.navigate(['edit-attributes', this.selectedAttribute.id])
  }
}
