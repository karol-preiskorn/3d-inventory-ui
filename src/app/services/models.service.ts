import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '../shared/model'
import { LogService } from './log.service'

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  baseurl = 'http://localhost:3000'
  model: Model
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
  ) {}
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetModels(): Observable<Model[]> {
    return this.http
      .get<Model[]>(this.baseurl + '/models/')
      .pipe(catchError(this.errorHandl))
  }

  GetModel(id: string | null): Observable<Model> {
    return this.http
      .get<Model>(this.baseurl + '/models/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }
  DeleteModel(id: string): Observable<Model> {
    return this.http
      .delete<Model>(this.baseurl + '/models/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }
  // POST
  CreateModel(data: Model): Observable<Model> {
    console.log('Service.CreateModel: ' + JSON.stringify(data, null, ' '))
    return this.http
      .post<Model>(
        this.baseurl + '/models/',
        JSON.stringify(data, null, ' '),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  CloneModel(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetModel(id).subscribe((value: Model) => {
      console.log('Get Model: ' + JSON.stringify(value, null, ' '))
      value.id = id_uuid
      this.model = value
      this.CreateModel(value).subscribe({
        next: (v) => {
          console.log('Create Model: ' + JSON.stringify(v, null, ' '))
          this.ngZone.run(() => this.router.navigateByUrl('models-list'))
        },
        complete: () =>
          this.ngZone.run(() => this.router.navigateByUrl('models-list')),
      })
    })
    console.log('Get after Model: ' + JSON.stringify(this.model, null, ' '))
    return id_uuid
  }
  // PUT
  UpdateModel(id: string | null, data: any): Observable<Model> {
    return this.http
      .put<Model>(
        this.baseurl + '/models/' + id,
        JSON.stringify(data, null, ' '),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  /**
   * TODO: file log? (watcom ect.)
   *
   * @param {{ error: { message: string }; status: any; message: any }} error
   * @return {*}
   * @memberof ModelsService
   */
  errorHandl(error: { error: { message: string }; status: any; message: any }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage, null, ' '))

    return throwError(() => {
      return errorMessage
    })
  }
}
