import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable, Input } from '@angular/core'
import { Observable, catchError, of, retry, throwError } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { environment } from '../../environments/environment'
import { getDateString } from '../shared/utils'

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

  /**
   * Retrieves the logs from the server.
   * @returns An Observable that emits an array of Log objects.
   */
  GetLogs(): Observable<Log[]> {
    return this.http
      .get<Log[]>(environment.baseurl + '/logs')
      .pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves the logs for a specific component.
   * @param component The name of the component.
   * @returns An Observable that emits an array of Log objects.
   */
  GetComponentLogs(component: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/' + component
    console.log('LogComponet.GetComponetLogs(' + component + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves the logs for a specific object.
   * @param object - The name of the object.
   * @returns An Observable that emits an array of Log objects.
   */
  GetObjectsLogs(object: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/' + object
    console.log('LogService.GetObjectsLogs.url: ' + url)
    return this.http.get<Log[]>(url).pipe(catchError(this.handleErrorTemplate<Log[]>('GetObjectsLogs', [])))
  }

  /**
   * Retrieves a log by its ID.
   * @param id The ID of the log to retrieve.
   * @returns An Observable that emits the retrieved log.
   */
  GetLogId(id: string | null): Observable<Log> {
    return this.http
      .get<Log>(environment.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Deletes a log entry by its ID.
   * @param id The ID of the log entry to delete.
   * @returns An Observable that emits the deleted log entry.
   */
  DeleteLog(id: string): Observable<Log> {
    return this.http
      .delete<Log>(environment.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Creates a log entry with the provided data.
   * @param data The data for the log entry.
   * @returns An Observable that emits the created log entry.
   */
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

  /**
   * Posts a log entry to the server.
   * @param data The log data to be posted.
   * @returns An Observable that emits the posted log entry.
   */
  postLog(data: Log): Observable<Log> {
    return this.http
      .post<Log>(`${environment.baseurl}/logs`, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Log>('postLog', data)))
  }

  /**
   * Extracts the data from the response object.
   * @param res The response object.
   * @returns The extracted data.
   */
  private extractData(res: Response) {
    const body = res.json()
    return body || {}
  }

  /**
   * Updates a log entry with the specified ID.
   * @param id - The ID of the log entry to update.
   * @param data - The updated data for the log entry.
   * @returns An Observable that emits the updated log entry.
   */
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
      console.log(`LogService.handleError----> ${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
