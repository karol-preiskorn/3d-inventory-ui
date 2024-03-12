import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable, Input } from '@angular/core'
import { Observable, catchError, of, retry, throwError } from 'rxjs'
import { environment } from '../../environments/environment'
import { getDateString } from '../shared/utils'

export interface LogParamteres {
  component: string
  id: string // id set then show id object logs
}

export interface Log {
  _id: string // logs uuid4
  date: string // date-time
  objectId?: string | null // objects uuid4
  operation: string // Edit, Delete, Create, Update
  component: string // [device, model, category, floor]
  message: string // object json
}

export interface LogIn {
  objectId?: string | null
  operation: string
  component: string
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  baseurl = environment.baseurl
  @Input() attributeComponentId: string

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(environment.baseurl + '/logs').pipe(retry(1), catchError(this.handleError))
  }

  GetComponentLogs(component: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/component/' + component.toLowerCase()
    console.log('LogComponent.GetComponentLogs(' + component.toLowerCase() + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  GetAttributeLogs(component: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/device/' + component.toLowerCase()
    console.log('LogComponent.GetModelLogs(' + component.toLowerCase() + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  GetObjectsLogs(objectId: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/' + objectId
    console.log('LogService.GetObjectsLogs.url: ' + url)
    return this.http.get<Log[]>(url).pipe(catchError(this.handleErrorTemplate<Log[]>('GetObjectsLogs', [])))
  }

  GetLogId(id: string | null): Observable<Log> {
    return this.http
      .get<Log>(environment.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  DeleteLog(id: string): Observable<Log> {
    return this.http
      .delete<Log>(environment.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  CreateLog(data: LogIn): Observable<Log | LogIn> {
    const log: LogIn = {
      objectId: data.objectId,
      operation: data.operation,
      component: data.component,
      message: data.message,
    }
    console.log('LogService.CreateLog: ' + JSON.stringify(log, null, ' '))
    return this.http
      .post<Log | LogIn>(`${environment.baseurl}/logs/`, JSON.stringify(log, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<LogIn>('CreateLog', log)))
  }

  postLog(data: Log): Observable<Log> {
    return this.http
      .post<Log>(`${environment.baseurl}/logs`, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Log>('postLog', data)))
  }

  private extractData(res: Response) {
    const body = res.json()
    return body || {}
  }

  UpdateLog(id: string | null, data: JSON): Observable<Log> {
    return this.http
      .put<Log>(environment.baseurl + '/logs/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Handles the error response from an HTTP request.
   * If the error status is 0, it logs the error message.
   * Otherwise, it logs the error status and body.
   * Returns an Observable that throws an Error.
   * @param error - The HttpErrorResponse object.
   * @returns An Observable that throws an Error.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error)
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error)
    }
    return throwError(() => new Error('Something bad happened; please try again later.'))
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleErrorTemplate<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(
        `LogService.handleErrorTemplate: ${operation} failed: ${error.message}`
      )
      return of(result as T)
    }
  }
}
