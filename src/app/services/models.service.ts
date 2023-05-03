import { Model } from '../shared/model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { retry, catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { LogService } from './log.service'

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  baseurl = 'http://localhost:3000'
  constructor(private http: HttpClient, private logService: LogService) {}
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }
  GetModels(): Observable<Model> {
    return this.http
      .get<Model>(this.baseurl + '/models/')
      .pipe(retry(1), catchError(this.errorHandl))
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
    return this.http
      .post<Model>(
        this.baseurl + '/models/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  // PUT
  UpdateModel(id: string | null, data: any): Observable<Model> {
    return this.http
      .put<Model>(
        this.baseurl + '/models/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  errorHandl(error: { error: { message: string }; status: any; message: any }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage))
    // logService.CreateLog({
    //   message: 'Error service Model: ' + JSON.stringify(error.message),
    //   category: 'Error',
    //   component: 'ModelService.errorHandl',
    // })
    return throwError(() => {
      return errorMessage
    })
  }
}
