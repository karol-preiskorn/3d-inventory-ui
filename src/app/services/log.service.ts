import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, Input } from '@angular/core'
import { Observable, catchError, of, retry, throwError } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { getDateString } from '../shared/utils'

 export interface LogParamteres {
  component: string
  id: string  // id set then show id object logs
}

export interface Log {
  id: string             // logs uuid4
  date: string           // date-time
  object?: string | null // objects uuid4
  operation: string      // Edit, Delete, Create, Update
  component: string      // [device, model, category]
  message: string        // object json
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

  baseurl = 'http://localhost:3000'
  @Input() attributeComponentId: string

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetLogs(): Observable<Log[]> {
    return this.http
      .get<Log[]>(this.baseurl + '/logs?_sort=date&_order=desc')
      .pipe(retry(1), catchError(this.errorHandl))
  }

  GetComponentLogs(component: string): Observable<Log[]> {
    const url = this.baseurl + '/logs?component=' + component + '&_sort=date&_order=desc'
    console.log('LogComponet.GetComponetLogs('+component+') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.errorHandl))
  }

  GetObjectsLogs(object: string): Observable<Log[]> {
    const url = this.baseurl + '/logs?object=' + object + '&_sort=date&_order=desc'
    console.log('LogService.GetObjectsLogs.url: ' + url)

    return this.http
      .get<Log[]>(url)
      .pipe(catchError(this.handleError<Log[]>('GetObjectsLogs', [])))
  }

  GetLogId(id: string | null): Observable<Log> {
    return this.http
      .get<Log>(this.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  DeleteLog(id: string): Observable<Log> {
    return this.http
      .delete<Log>(this.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
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
    console.log('LogService.CreateLog(' + JSON.stringify(log) + ')')
    //this.postLog(log)
    return this.http
      .post<Log>(`${this.baseurl}/logs/`, JSON.stringify(log), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError<Log>('CreateLog', log)))
  }


  postLog(data: Log): Observable<Log> {
    return this.http
      .post<Log>(`${this.baseurl}/logs`, JSON.stringify(data), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  private extractData(res: Response) {
    const body = res.json()
    return body || {}
  }

  UpdateLog(id: string | null, data: any): Observable<Log> {
    return this.http
      .put<Log>(
        this.baseurl + '/logs/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  errorHandl(err: any) {
    let message = ''
    if (err.error instanceof ErrorEvent) {
      message = err.error.message
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`
    }
    console.log('-----> LogService.errorHandl: ' + message)
    return throwError(() => {
      message
    })
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`LogService.handleError----> ${operation} failed: ${error.message}`)

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`)
    this.log(`LogService.handleError.log: ${message}`)
  }
}
