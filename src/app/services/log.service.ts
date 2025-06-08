/**
 * @file /src/app/services/log.service.ts
 * @module /src/app/services
 * @description This file contains the LogService class which provides methods for interacting with the logs API.
 * @version 2024-03-14 C2RLO - Initial
 **/

import { catchError, Observable, of, retry, throwError } from 'rxjs'

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from '../../environments/environment'

/**
 * Represents the parameters for retrieving logs.
 */
export interface LogParameters {
  component: string
  id: string // id set then show id object logs
}

/**
 * Represents a log entry.
 */
export interface Log {
  _id: string
  date: string
  objectId?: string
  operation: string // [create, update, delete, clone]
  component: string // [device, model, category, floor]
  message: object // object json
}

/**
 * Represents the input for creating a log entry.
 */
export interface LogIn {
  objectId?: string
  operation: string
  component: string
  message: object
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  baseurl = environment.baseurl
  attributeComponentId?: string

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  /**
   * Retrieves all logs.
   * @returns An Observable that emits an array of Log objects.
   */
  GetLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(environment.baseurl + '/logs').pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves logs for a specific component.
   * @param component - The component name.
   * @returns An Observable that emits an array of Log objects.
   */
  GetComponentLogs(component: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/component/' + component
    console.log('[log.service.GetComponentLogs(' + component + ')]: ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves logs for a specific device.
   * @param id - The device ID.
   * @returns An Observable that emits an array of Log objects.
   */
  GetDeviceLogs(id: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/devices/' + id
    console.log('LogComponent.GetDeviceLogs(' + id + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves logs for a specific attribute.
   * @param id - The attribute ID.
   * @returns An Observable that emits an array of Log objects.
   */
  GetAttributeLogs(id: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/attributes/' + id
    console.log('LogComponent.GetAttributeLogs(' + id + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves a log by ID.
   * @param id - The all logs with ObjectID = id.
   * @returns An Observable that emits a Log object.
   */
  GetLogsById(id: string): Observable<Log[]> {
    return this.http
      .get<Log[]>(environment.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Deletes a log by ID.
   * @param id - The log ID.
   * @returns An Observable that emits a Log object.
   */
  DeleteLog(id: string): Observable<Log> {
    return this.http
      .delete<Log>(environment.baseurl + '/logs/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

  private getLogsUrl(): string {
    return `${environment.baseurl}/logs/`
  }

  CreateLog(data: LogIn): Observable<Log> {
    return this.http
      .post<Log>(this.getLogsUrl(), data, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Log>('CreateLog', data as Log)))
  }

  /**
   * Updates a log entry.
   * @param id - The log ID.
   * @param data - The updated log data.
   * @returns An Observable that emits a Log object.
   */
  UpdateLog(id: string | null, data: any): Observable<Log | LogIn> {
    const sData = JSON.stringify(data, null, 2)
    return this.http
      .put<Log | LogIn>(environment.baseurl + '/logs/' + id, sData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<LogIn>('UpdateLog', data as LogIn)))
  }

  /**
   * Handles the error response from an HTTP request. If the error status is 0, it logs the error message.
   * Otherwise, it logs the error status and body. Returns an Observable that throws an Error.
   * @param error - The HttpErrorResponse object.
   * @returns An Observable that throws an Error.
   */
  private handleError(error: HttpErrorResponse) {
    // If error.status is 0, it indicates a client-side or network error occurred.
    if (error.status === 0) {
      console.error('An error occurred:', error.error)
      console.error('An unknown error occurred:', error)
      return throwError(() => new Error('An unknown error occurred. Please check the logs for more details.'))
    } else {
      // If error.status is not 0, it indicates a server-side error with a specific status code.
      return throwError(
        () => new Error(`Error occurred: ${error.status} - ${error.message ?? 'No error message provided'}`),
      )
    }
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   *
   * @param operationName - Name of the operation that failed.
   * @param result - Optional fallback value to return as the observable result in case of an error.
   *                 This value is used to allow the application to continue functioning gracefully
   *                 even when an error occurs.
   */
  private handleErrorTemplate<T>(operationName = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (environment.production) {
        console.error(`LogService.handleErrorTemplate: ${operationName} failed. Error message: ${error.message}`)
      } else {
        console.error(`LogService.handleErrorTemplate: ${operationName} failed. Error message: ${error.message}`, error)
      }
      const fallbackResult = result ?? ({} as T)
      return of(fallbackResult)
    }
  }
}
