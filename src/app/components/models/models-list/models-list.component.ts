import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ModelsService } from 'src/app/services/models.service'
import { LogService } from 'src/app/services/log.service'
import { Model } from 'src/app/shared/model'

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.scss'],
})
export class ModelsListComponent implements OnInit {
  ModelsList: Model[] = []
  selectedModel: Model
  page = 1
  ngOnInit() {
    this.loadModels()
  }
  constructor(
    public modelsService: ModelsService,
    private logService: LogService,
    private router: Router
  ) {}
  loadModels() {
    return this.modelsService.GetModels().subscribe((data: any) => {
      this.ModelsList = data
    })
  }
  deleteModel(id: string) {
    this.logService.CreateLog({
      message: 'Delete model: ' + id,
      category: 'Info',
      component: 'ModelListComponent',
    })
    return this.modelsService.DeleteModel(id).subscribe((data: any) => {
      console.log(data)
      this.loadModels()
      this.router.navigate(['/models-list/'])
    })
  }
  AddForm() {
    this.router.navigateByUrl('/add-model')
  }
  EditForm(model: Model) {
    this.selectedModel = model
    this.router.navigate(['/edit-model/', model.id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
