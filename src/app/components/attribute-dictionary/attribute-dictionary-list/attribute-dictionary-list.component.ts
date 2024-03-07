import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { LogService } from 'src/app/services/log.service'
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'

@Component({
  selector: 'app-attribute-dictionary-list',
  templateUrl: './attribute-dictionary-list.component.html',
  styleUrls: ['./attribute-dictionary-list.component.scss'],
})
export class AttributeDictionaryListComponent implements OnInit {
  attributeDictionaryList: AttributeDictionary[] = []
  selectedAttributeDictionary: AttributeDictionary
  attributeDictionaryPage = 1
  component = 'Attribute Dictionary'

  ngOnInit() {
    this.loadAttributeDictionary()
  }
  constructor(
    public attributeDictionaryService: AttributeDictionaryService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone
  ) { }
  loadAttributeDictionary() {
    return this.attributeDictionaryService
      .GetAttributeDictionaries()
      .subscribe((data: AttributeDictionary[]) => {
        this.attributeDictionaryList = data
      })
  }
  deleteAttributeDictionary(id: string) {
    this.logService.CreateLog({
      message: id,
      objectId: id,
      operation: 'Delete',
      component: 'AttributeDictionary',
    })
    return this.attributeDictionaryService
      .DeleteAttributeDictionary(id)
      .subscribe((data: AttributeDictionary) => { // Specify the appropriate type for 'data'
        console.log(data)
        this.loadAttributeDictionary()
        this.router.navigate(['/attribute-dictionary-list'])
      })
  }

  async CloneAttributeDictionary(id: string) {
    const id_new: string =
      this.attributeDictionaryService.CloneAttributeDictionary(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
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
