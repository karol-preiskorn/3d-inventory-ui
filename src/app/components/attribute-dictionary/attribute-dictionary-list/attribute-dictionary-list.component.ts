import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { LogService } from '../../../services/log.service'
import { AttributeDictionary } from '../../../shared/attribute-dictionary'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { LogComponent } from '../../log/log.component'

@Component({
  selector: 'app-attribute-dictionary-list',
  templateUrl: './attribute-dictionary-list.component.html',
  styleUrls: ['./attribute-dictionary-list.component.scss'],
  standalone: true,
  imports: [CommonModule, LogComponent, NgbPaginationModule],
})
export class AttributeDictionaryListComponent implements OnInit {
  attributeDictionaryList: AttributeDictionary[] = []
  selectedAttributeDictionary: AttributeDictionary
  attributeDictionaryPage = 1
  component = 'Attribute Dictionary'
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
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributeDictionary[]) => {
      this.attributeDictionaryList = data
    })
  }
  deleteAttribute(attributeId: string): void {
    // Implement the logic to delete the attribute
    console.log(`Deleting attribute with ID: ${attributeId}`)
    // Add your deletion logic here
  }
  deleteAttributeDictionary(id: string) {
    this.logService.CreateLog({
      message: { id },
      objectId: id.toString(),
      operation: 'Delete',
      component: 'AttributeDictionary',
    })
    return this.attributeDictionaryService.DeleteAttributeDictionary(id).subscribe((data: AttributeDictionary) => {
      // Specify the appropriate type for 'data'
      console.log(data)
      this.loadAttributeDictionary()
      this.router.navigate(['/attribute-dictionary-list'])
    })
  }

  async CloneAttributeDictionary(id: string) {
    const id_new: string = this.attributeDictionaryService.CloneAttributeDictionary(id)
    this.logService
      .CreateLog({
        message: {
          id: id,
          id_new: id_new,
        },
        operation: 'Clone',
        component: 'AttributeDictionary',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
      })
    // this.loadAttributeDictionary()
    // this.router.navigate(['/attribute-dictionary-list'])
  }

  AddForm() {
    this.router.navigateByUrl('add-attribute-dictionary')
  }

  EditForm(attributeDictionary: AttributeDictionary) {
    this.selectedAttributeDictionary = attributeDictionary
    this.router.navigate(['edit-attribute-dictionary', this.selectedAttributeDictionary._id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
