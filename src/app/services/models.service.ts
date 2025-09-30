import { Observable, of } from 'rxjs'
import { catchError, map, retry } from 'rxjs/operators'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { Model } from '../shared/model'
import { LogService } from './log.service'
import { DebugService } from './debug.service'

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    timestamp: string
    version: string
  }
}

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
    private debugService: DebugService,
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
    console.warn('🚀 ModelsService: Calling API:', `${this.baseurl}/models`);
    return this.http
      .get<ApiResponse<Model[]>>(`${this.baseurl}/models`, this.httpOptions)
      .pipe(
        map(response => {
          console.warn('✅ ModelsService: API returned', response.data?.length || 0, 'models');
          return response.data;
        }), // Extract data from API response
        retry(1),
        catchError(this.handleErrorTemplate<Model[]>('GetModels', []))
      )
  }
  /**
   * Retrieves a model by its ID.
   * @param id The ID of the model to retrieve.
   * @returns An Observable that emits the retrieved model.
   */
  GetModel(id: string): Observable<Model> {
    return this.http
      .get<Model>(`${this.baseurl}/models/${encodeURIComponent(id)}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleErrorTemplate<Model>('GetModel', {} as Model))
      )
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
    this.debugService.api('POST', '/models', data)
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
    this.debugService.debug('CloneModel called with id:', id)
    let idConed = ''
    this.GetModel(id).subscribe((value: Model) => {
      this.debugService.debug('Get Model:', value)
      this.CreateModel(value).subscribe(
        (v: Model | { acknowledged: boolean; insertedId: string }) => {
          this.debugService.debug('Create Model:', v)
          if ('_id' in v) {
            idConed = String(v._id) // Convert 'ObjectId' to string
          } else if ('insertedId' in v) {
            idConed = String(v.insertedId)
          }
          this.ngZone.run(() => this.router.navigateByUrl('models-list'))
        },
        (err: Error | unknown) => {
          this.debugService.error('CloneModel error:', err)
          catchError(this.handleErrorTemplate<Model>('CloneModel', value))
        },
        () => this.ngZone.run(() => this.router.navigateByUrl('models-list')),
      )
    })
    this.debugService.debug('Get after Model:', this.model)
    return idConed
  }

  /**
   * Updates a model with the specified ID.
   * @param id - The ID of the model to update.
   * @param data - The updated data for the model.
   * @returns An Observable that emits the updated model.
   */
  UpdateModel(id: string, data: Model): Observable<Model> {
    return this.http
      .put<Model>(`${this.baseurl}/models/${id}`, data, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleErrorTemplate<Model>('UpdateModel', {} as Model))
      )
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @template T - The type of the result expected from the operation
   */
  private handleErrorTemplate<T>(operation = 'operation', result?: T) {
    return (error: Error & { status?: number; message: string }): Observable<T> => {
      this.debugService.error(
        `ModelsService.handleErrorTemplate: ${operation} failed: ${error.message}, Status: ${error.status || 'N/A'}, Stack: ${error.stack || 'N/A'}`
      )
      this.debugService.error(`ModelsService.handleErrorTemplate: ${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
