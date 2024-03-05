import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { Model } from 'src/app/shared/model'


@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.scss'],
})
export class ModelsListComponent implements OnInit {
  ModelsList: Model[] = []
  selectedModel: Model
  modelListPage = 1
  component = 'Models'

  constructor(
    public modelsService: ModelsService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  /**
   * Loads the models by calling the GetModels method of the models service.
   * @returns An Observable that emits the loaded models data.
   */
  loadModels() {
    return this.modelsService.GetModels().subscribe((data: Model[]) => {
      this.ModelsList = data
    })
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.loadModels()
  }

  /**
   * Deletes a model with the specified ID.
   * @param id The ID of the model to delete.
   */
  DeleteModel(id: string) {
    this.logService.CreateLog({
      message: id,
      objectId: id,
      operation: 'Delete',
      component: 'Models',
    })
    return this.modelsService.DeleteModel(id).subscribe((data: Model) => { // Update the callback function parameter type to Model
      console.log(data)
      this.loadModels()
      this.router.navigate(['/models-list'])
    })
  }

  /**
   * Clones a model with the specified ID.
   *
   * @param id The ID of the model to clone.
   * @returns The ID of the newly cloned model.
   */
  async CloneModel(id: string) {
    const id_new: string = this.modelsService.CloneModel(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: 'Models',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      })
    this.loadModels()
    this.router.navigate(['/models-list'])
  }

  /**
   * Navigates to the 'add-model' route.
   */
  AddModel() {
    this.router.navigate(['/add-model'])
  }

  /**
   * Edits the specified model.
   *
   * @param model The model to be edited.
   */
  EditModel(model: Model) {
    this.selectedModel = model
    this.router.navigate(['edit-model', model._id])
    this.ngZone.run(() => this.router.navigateByUrl(`edit-model/${model._id}`))
  }
}
