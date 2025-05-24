import { Observable, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { Model } from '../shared/model'
import { LogService } from './log.service'

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
   * @param data The data of the model to be created.
   * @returns An Observable that emits the created model.
   */
  CreateModel(data: Model): Observable<{ acknowledged: boolean; insertedId: string } | Model> {
    console.log('Service.CreateModel: ' + JSON.stringify(data, null, ' '))
    return this.http
      .post<Model>(environment.baseurl + '/models/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(
        retry(1),
        catchError(
          this.handleErrorTemplate<{ acknowledged: boolean; insertedId: string } | Model>('CreateModel', data),
        ),
      )
  }

  /**
   * Clones a model with the specified ID.
   * @param id - The ID of the model to clone.
   * @returns The UUID of the cloned model.
   */
  CloneModel(id: string): string {
    console.log(`ModelService.CloneModel: ${JSON.stringify(id, null, ' ')}`)
    let idConed = ''
    this.GetModel(id).subscribe((value: Model) => {
      console.log('Get Model: ' + JSON.stringify(value, null, ' '))
      this.CreateModel(value).subscribe(
        (v: Model | { acknowledged: boolean; insertedId: string }) => {
          console.log('Create Model: ' + JSON.stringify(v, null, ' '))
          if ('_id' in v) {
            idConed = String(v._id) // Convert 'ObjectId' to string
          } else if ('insertedId' in v) {
            idConed = String(v.insertedId)
          }
          this.ngZone.run(() => this.router.navigateByUrl('models-list'))
        },
        (err: any) => {
          console.error(err)
          catchError(this.handleErrorTemplate<Model>('CloneModel', value))
        },
        () => this.ngZone.run(() => this.router.navigateByUrl('models-list')),
      )
    })
    console.log('Get after Model: ' + JSON.stringify(this.model, null, ' '))
    return idConed
  }

  /**
   * Updates a model with the specified ID.
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
