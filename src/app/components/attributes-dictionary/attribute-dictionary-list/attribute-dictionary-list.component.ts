import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ModelsService } from 'src/app/services/models.service'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'
import { LogService } from 'src/app/services/log.service'
import { Model } from 'src/app/shared/model'
import { AttributeDictionary } from 'src/app/shared/attributeDictionary'

@Component({
  selector: 'app-attribute-dictionary-list',
  templateUrl: './attribute-dictionary-list.component.html',
  styleUrls: ['./attribute-dictionary-list.component.scss'],
})
export class AttributeDictionaryListComponent implements OnInit {
  ModelsList: Model[] = []
  AttributeDictionaryList: AttributeDictionary[] = []

  selectedAttributeDictionary: AttributeDictionary
  page = 1
  component = 'AttributeDictionary'

  ngOnInit() {
    this.loadAttributeDictionary()
  }
  constructor(
    public attributeDictionaryService: AttributeDictionaryService,
    public modelsService: ModelsService,
    private logService: LogService,
    private router: Router,

    private ngZone: NgZone
  ) {}
  loadAttributeDictionary() {
    return this.attributeDictionaryService
      .GetAttributeDictionaries()
      .subscribe((data: any) => {
        this.ModelsList = data
      })
  }
  deleteAttributeDictionary(id: string) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: 'AttributeDictionary',
    })
    return this.attributeDictionaryService
      .DeleteAttributeDictionary(id)
      .subscribe((data: any) => {
        console.log(data)
        this.loadAttributeDictionary()
        this.router.navigate(['/models-list'])
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
        this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      })
    this.loadAttributeDictionary()
    this.router.navigate(['/models-list'])
  }

  AddForm() {
    this.router.navigateByUrl('/add-model')
  }
  EditForm(attributeDictionary: AttributeDictionary) {
    this.selectedAttributeDictionary = attributeDictionary
    this.router.navigate(['/edit-attribute-dictionary', this.selectedAttributeDictionary.id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
