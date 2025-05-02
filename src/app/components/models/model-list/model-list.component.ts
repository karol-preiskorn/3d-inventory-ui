import { Component, NgZone, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { of, Observable } from 'rxjs'

import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Model } from '../../../shared/model'
import { LogComponent } from '../../log/log.component'
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-models-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbPagination, LogComponent], // Add LogComponent to imports
})
export class ModelsListComponent implements OnInit {
  modelListPage: number = 1
  pageSize = 10 // Number of items per page
  totalItems = 0 // Total number of items
  ModelsList: Array<any> = []
  component: string = 'Models'
  selectedModel: Model | null = null // Declare selectedModel property

  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone,
    public modelsService: ModelsService,
    private readonly logService: LogService,
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
    console.log(`ModelsListComponent initialized with component: ${this.component}`)
  }

  /**
   * Deletes a model with the specified ID.
   * @param id The ID of the model to delete.
   */
  DeleteModel(id: string) {
    this.logService.CreateLog({ message: { id: id }, objectId: id, operation: 'Delete', component: this.component })
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
      .CreateLog({ message: { id: id, new_id: idCloned }, operation: 'Clone', component: 'Model' })
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
    this.selectedModel = model // Assign the selected model
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
