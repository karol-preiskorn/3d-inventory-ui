import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Log, LogIn, LogService } from './log.service'
import { Observable, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { Model } from '../shared/model'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  baseurl = environment.baseurl
  model: Model = {} as Model
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router,
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  /**
   * Retrieves the models from the server.
   * @returns An Observable that emits an array of Model objects.
   */
  GetModels(): Observable<Model[]> {
    return this.http
      .get<Model[]>(environment.baseurl + '/models/')
      .pipe(retry(1), catchError(this.handleErrorTemplate<Model[]>('GetModel')))
  }
  /**
   * Retrieves a model by its ID.
   * @param id The ID of the model to retrieve.
   * @returns An Observable that emits the retrieved model.
   */
  GetModel(id: string): Observable<Model> {
    return this.http
      .get<Model>(environment.baseurl + '/models/' + String(id), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Model>('GetModel', id as unknown as Model)))
  }

  /**
   * Deletes a model by its ID.
   *
   * @param id The ID of the model to delete.
   * @returns An Observable that emits the deleted model.
   */
  DeleteModel(id: string): Observable<Model> {
    return this.http
      .delete<Model>(environment.baseurl + '/models/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Model>('DeleteModel', id as unknown as Model)))
  }

  /**
   * Creates a new model.
   *
   * @param data The data of the model to be created.
   * @returns An Observable that emits the created model.
   */
  CreateModel(data: Model): Observable<Model> {
    console.log('Service.CreateModel: ' + JSON.stringify(data, null, ' '))
    return this.http
      .post<Model>(environment.baseurl + '/models/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Model>('CreateModel', data)))
  }

  /**
   * Clones a model with the specified ID.
   *
   * @param id - The ID of the model to clone.
   * @returns The UUID of the cloned model.
   */
  async CloneModel(id: string): Promise<string> {
    console.log(`ModelService.CloneModel: ${JSON.stringify(id, null, ' ')}`)
    let idConed = ''
    let modelToCreate: Model = {} as Model
    this.GetModel(id).subscribe((value: Model) => {
      modelToCreate = value
      if (modelToCreate._id !== undefined) {
        delete (modelToCreate as { _id?: string })._id
      }
      modelToCreate.name += ' (Clone)'
      this.CreateModel(modelToCreate).subscribe({
        next: (createdModel) => {
          idConed = String(createdModel._id)
          const log: LogIn = {
            objectId: createdModel._id,
            operation: 'Clone',
            component: 'Model',
            message: createdModel,
          }
          this.http
            .post<Log | LogIn>(`${environment.baseurl}/logs/`, log, this.httpOptions)
            .pipe(retry(1), catchError(this.handleErrorTemplate<LogIn>('CreateLog for CloneModel', log)))
            .subscribe()
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('models-list')),
        error: (err) => {
          console.error(err)
          catchError(this.handleErrorTemplate<Model>('CloneModel', value))
        },
      })
    })
    return idConed
  }

  /**
   * Updates a model with the specified ID.
   *
   * @param id - The ID of the model to update.
   * @param data - The updated data for the model.
   * @returns An Observable that emits the updated model.
   */
  UpdateModel(id: string, data: Model): Observable<Model> {
    console.log(`ModelService.UpdateModel: ${JSON.stringify(data, null, ' ')}`)
    return this.http
      .put<Model>(environment.baseurl + '/models/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Model>('UpdateModel', data)))
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleErrorTemplate<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(`ModelsService.handleErrorTemplate: ${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
