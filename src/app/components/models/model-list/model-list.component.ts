import { Observable, of } from 'rxjs'

import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Model } from '../../../shared/model'

@Component({
  selector: 'app-models-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
})
export class ModelsListComponent implements OnInit {
  ModelsList: Array<Model> = []
  selectedModel: Model
  modelListPage = 1
  component: string = 'Models'

  constructor(
    public modelsService: ModelsService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  /**
   * Loads the models by calling the GetModels method of the models service.
   * @returns An Observable that emits the loaded models data.
   */
  loadModels(): Observable<Model[]> {
    return this.modelsService.GetModels()
  }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.loadModels().subscribe((data: Model[]) => {
      this.ModelsList = data
    })
  }

  /**
   * Deletes a model with the specified ID.
   * @param id The ID of the model to delete.
   */
  DeleteModel(id: string) {
    this.logService.CreateLog({
      message: { id: id },
      objectId: id,
      operation: 'Delete',
      component: this.component,
    })
    return this.modelsService.DeleteModel(id).subscribe(() => {
      console.log(id + ' deleted')
      this.ngOnInit()
      this.router.navigate(['/models-list/'])
    })
  }

  /**
   * Clones a model with the specified ID.
   *
   * @param id The ID of the model to clone.
   * @returns The ID of the newly cloned model.
   */
  async CloneModel(id: string): Promise<string> {
    const idCloned = this.modelsService.CloneModel(id)
    this.logService
      .CreateLog({
        message: { id: id, new_id: idCloned },
        operation: 'Clone',
        component: 'Model',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('models-list'))
      })
    this.loadModels()
    this.router.navigate(['/models-list'])
    return idCloned
  }

  /**
   * Navigates to the 'add-model' route.
   */
  AddModel(): void {
    this.router.navigate(['/add-model'])
  }

  /**
   * Edits the specified model.
   *
   * @param model The model to be edited.
   */
  EditModel(model: Model): void {
    this.selectedModel = model
    this.router.navigate(['edit-model', model._id])
    this.ngZone.run(() => this.router.navigateByUrl(`edit-model/${model._id}`))
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @returns An Observable with the error result.
   */
  private handleErrorTemplate<T>(operation = 'operation', result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      console.error(`ModelsListComponent.handleErrorTemplate: ${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
