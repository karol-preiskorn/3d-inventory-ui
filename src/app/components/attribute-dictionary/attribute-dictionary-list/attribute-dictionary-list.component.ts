import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { LogService } from '../../../services/log.service'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

import { LogComponent } from '../../log/log.component'

@Component({
  selector: 'app-attribute-dictionary-list',
  templateUrl: './attribute-dictionary-list.component.html',
  styleUrls: ['./attribute-dictionary-list.component.scss'],
  standalone: true,
  imports: [LogComponent, NgbPaginationModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeDictionaryListComponent implements OnInit {
  attributeDictionaryList: AttributesDictionary[] = []
  selectedAttributeDictionary: AttributesDictionary
  attributeDictionaryPage = 1
  component = 'attributesDictionary'
  isComponent = true
  componentName = 'Attributes Dictionary'
  pageSize: number = 10

  ngOnInit() {
    this.loadAttributeDictionary()
  }
  constructor(
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone,
  ) {}
  loadAttributeDictionary() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributesDictionary[]) => {
      this.attributeDictionaryList = data
    })
  }

  deleteAttribute(_attributeId: string): void {
    // Implement the logic to delete the attribute
    // Deleting attribute with ID: ${attributeId}
    // Add your deletion logic here
  }

  deleteAttributeDictionary(id: string) {
    this.logService.CreateLog({
      message: { id },
      objectId: id.toString(),
      operation: 'Delete',
      component: 'attributesDictionary',
    })
    return this.attributeDictionaryService.DeleteAttributeDictionary(id).subscribe((_data: AttributesDictionary) => {
      // Specify the appropriate type for 'data'
      // Attribute dictionary deleted successfully
      this.loadAttributeDictionary()
      this.router.navigate(['/attribute-dictionary-list'])
    })
  }

  CloneAttributeDictionary(id: string) {
    this.attributeDictionaryService.CloneAttributeDictionary(id).subscribe((cloned: AttributesDictionary) => {
      const id_new: string = cloned._id
      this.logService
        .CreateLog({
          message: {
            id: id,
            id_new: id_new,
          },
          operation: 'Clone',
          component: 'attributesDictionary',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
        })
    })
    // this.loadAttributeDictionary()
    // this.router.navigate(['/attribute-dictionary-list'])
  }

  AddForm() {
    this.router.navigateByUrl('add-attribute-dictionary')
  }

  EditForm(attributeDictionary: AttributesDictionary) {
    this.selectedAttributeDictionary = attributeDictionary
    this.router.navigate(['edit-attribute-dictionary', this.selectedAttributeDictionary._id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
