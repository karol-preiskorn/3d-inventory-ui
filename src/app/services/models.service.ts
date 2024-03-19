import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Injectable, NgZone} from '@angular/core'
import {Router} from '@angular/router'
import {Observable, of, throwError} from 'rxjs'
import {catchError, retry} from 'rxjs/operators'
import {v4 as uuidv4} from 'uuid'
import {environment} from '../../environments/environment'
import {Model} from '../shared/model'
import {LogService} from './log.service'

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  baseurl = environment.baseurl
  model: Model
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
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
    return this.http.get<Model[]>(environment.baseurl + '/models/').pipe(catchError(this.errorHandl))
  }

  /**
   * Retrieves a model by its ID.
   * @param id The ID of the model to retrieve.
   * @returns An Observable that emits the retrieved model.
   */
  GetModel(id: string | null): Observable<Model> {
    return this.http
      .get<Model>(environment.baseurl + '/models/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Deletes a model by its ID.
   * @param id The ID of the model to delete.
   * @returns An Observable that emits the deleted model.
   */
  DeleteModel(id: string): Observable<Model> {
    return this.http
      .delete<Model>(environment.baseurl + '/models/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Creates a new model.
   * @param data The data of the model to be created.
   * @returns An Observable that emits the created model.
   */
  CreateModel(data: Model): Observable<Model> {
    console.log('Service.CreateModel: ' + JSON.stringify(data, null, ' '))
    return this.http
      .post<Model>(environment.baseurl + '/models/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Clones a model with the specified ID.
   * @param id - The ID of the model to clone.
   * @returns The UUID of the cloned model.
   */
  CloneModel(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetModel(id).subscribe((value: Model) => {
      console.log('Get Model: ' + JSON.stringify(value, null, ' '))
      value._id = id_uuid
      this.model = value
      this.CreateModel(value).subscribe({
        next: (v) => {
          console.log('Create Model: ' + JSON.stringify(v, null, ' '))
          this.ngZone.run(() => this.router.navigateByUrl('models-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('models-list')),
      })
    })
    console.log('Get after Model: ' + JSON.stringify(this.model, null, ' '))
    return id_uuid
  }

  /**
   * Updates a model with the specified ID.
   * @param id - The ID of the model to update.
   * @param data - The updated data for the model.
   * @returns An Observable that emits the updated model.
   */
  UpdateModel(id: string | null, data: Model): Observable<Model> {
    return this.http
      .put<Model>(environment.baseurl + '/models/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Handles the error response from an HTTP request.
   * @param error - The error object containing the error message and status.
   * @returns An Observable that emits the error message.
   */
  errorHandl(error: {error: {message: string}; status: number; message: string}): Observable<never> {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage, null, ' '))

    return throwError(() => {
      return errorMessage
    })
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   *
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
