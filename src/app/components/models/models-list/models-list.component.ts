import { Component, NgZone, OnInit } from '@angular/core'
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
  component = 'Model'

  ngOnInit() {
    this.loadModels()
  }
  constructor(
    public modelsService: ModelsService,
    private logService: LogService,
    private router: Router,

    private ngZone: NgZone
  ) {}
  loadModels() {
    return this.modelsService.GetModels().subscribe((data: any) => {
      this.ModelsList = data
    })
  }
  deleteModel(id: string) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: 'Model',
    })
    return this.modelsService.DeleteModel(id).subscribe((data: any) => {
      console.log(data)
      this.loadModels()
      this.router.navigate(['/models-list'])
    })
  }

  async CloneModel(id: string) {
    const id_new: string = this.modelsService.CloneModel(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: 'Model',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      })
    this.loadModels()
    this.router.navigate(['/models-list'])
  }

  AddForm() {
    this.router.navigateByUrl('/add-model')
  }
  EditForm(model: Model) {
    this.selectedModel = model
    this.router.navigate(['/edit-model', model.id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
