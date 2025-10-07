import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'

import { DebugService } from '../../../services/debug.service'
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelsListComponent implements OnInit {
  modelListPage: number = 1
  pageSize = 10 // Number of items per page
  totalItems = 0 // Total number of items
  ModelsList: Array<Model> = []
  component: string = 'models'
  componentName: string = 'Models'
  selectedModel: Model | null = null // Declare selectedModel property

  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone,
    public modelsService: ModelsService,
    private readonly logService: LogService,
    private readonly debugService: DebugService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /**
   * Loads the models by calling the GetModels method of the models service.
   */
  loadModels(): void {
    this.modelsService.GetModels().subscribe({
      next: (data: Model[]) => {
        console.warn('✅ Loaded', data.length, 'models from API');
        this.ModelsList = data
        this.totalItems = data.length
        // Trigger change detection since we're using OnPush strategy
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('❌ Error loading models:', error);
        this.debugService.error('Error loading models:', error);
      }
    })
  }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.loadModels()
    this.debugService.debug(`ModelsListComponent initialized with component: ${this.component}`);
  }

  /**
   * Deletes a model with the specified ID.
   * @param id The ID of the model to delete.
   */
  DeleteModel(id: string) {
    this.logService.CreateLog({ message: JSON.stringify({ id, action: 'Delete model' }), objectId: id, operation: 'Delete', component: this.component })
    return this.modelsService.DeleteModel(id).subscribe(() => {
      this.debugService.info(id + ' deleted');
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
  CloneModel(id: string): void {
    try {
      const clonedId = this.modelsService.CloneModel(id)
      this.logService
        .CreateLog({ message: JSON.stringify({ originalId: id, clonedId, action: 'Clone model' }), operation: 'Clone', component: this.component })
        .subscribe({
          next: () => {
            this.debugService.info(`Model cloned with new ID: ${clonedId}`);
            this.loadModels()
            this.ngZone.run(() => this.router.navigateByUrl('models-list'))
          },
          error: (err) => {
            console.error('Error occurred while logging clone operation:', err)
          },
        })
    } catch (error) {
      console.error('Error occurred while cloning model:', error)
    }
  }

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
