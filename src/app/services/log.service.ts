import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable, Input } from '@angular/core'
import { Observable, catchError, of, retry, throwError } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { getDateString } from '../shared/utils'
import { environment } from '../../environments/environment'

export interface LogParamteres {
  component: string
  id: string // id set then show id object logs
}

export interface Log {
  id: string // logs uuid4
  date: string // date-time
  object?: string | null // objects uuid4
  operation: string // Edit, Delete, Create, Update
  component: string // [device, model, category, floor]
  message: string // object json
}

export interface LogIn {
  object?: string | null
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
    return this.http
      .get<Log[]>(environment.baseurl + '/logs?_sort=date&_order=desc')
      .pipe(retry(1), catchError(this.handleError))
  }

  GetComponentLogs(component: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs?component=' + component + '&_sort=date&_order=desc'
    console.log('LogComponet.GetComponetLogs(' + component + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  GetObjectsLogs(object: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs?object=' + object + '&_sort=date&_order=desc'
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

  CreateLog(data: LogIn): Observable<Log> {
    const log: Log = {
      id: uuidv4(),
      date: getDateString(),
      object: data.object,
      operation: data.operation,
      component: data.component,
      message: data.message,
    }
    console.log('LogService.CreateLog: ' + JSON.stringify(log, null, ' '))
    return this.http
      .post<Log>(`${environment.baseurl}/logs/`, JSON.stringify(log, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Log>('CreateLog', log)))
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error)
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error)
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'))
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleErrorTemplate<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`LogService.handleError----> ${operation} failed: ${error.message}`)
      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
