/**
 * @file /src/app/services/log.service.ts
 * @module /src/app/services
 * @description This file contains the LogService class which provides methods for interacting with the logs API.
 * @version 2024-03-14 C2RLO - Initial
 **/

import { catchError, Observable, of, retry, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';

import { environment } from '../../environments/environment';

/**
 * Represents the parameters for retrieving logs.
 */
export interface LogParamteres {
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
  @Input() attributeComponentId?: string

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
    console.log('LogComponent.GetComponentLogs(' + component + '): ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves logs for a specific device.
   * @param id - The device ID.
   * @returns An Observable that emits an array of Log objects.
   */
  GetDeviceLogs(id: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/device/' + id
    console.log('LogComponent.GetDeviceLogs(' + id + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves logs for a specific attribute.
   * @param id - The attribute ID.
   * @returns An Observable that emits an array of Log objects.
   */
  GetAttributeLogs(id: string): Observable<Log[]> {
    const url = environment.baseurl + '/logs/attribute/' + id
    console.log('LogComponent.GetAttributeLogs(' + id + ') ' + url)
    return this.http.get<Log[]>(url).pipe(retry(1), catchError(this.handleError))
  }

  /**
   * Retrieves logs for a specific object.
   * @param objectId - The object ID.
   * @returns An Observable that emits an array of Log objects.
   */
  GetObjectLogs(objectId: string): Observable<Log[]> {
    if (objectId == null) {
      return of([])
    }
    const url = environment.baseurl + '/logs/object/' + objectId
    console.log('LogService.GetObjectLogs: ' + url + ', objectId: ' + objectId)
    return this.http.get<Log[]>(url).pipe(catchError(this.handleErrorTemplate<Log[]>('GetObjectsLogs', [])))
  }

  /**
   * Retrieves a log by ID.
   * @param id - The log ID.
   * @returns An Observable that emits a Log object.
   */
  GetLogId(id: string): Observable<Log> {
    return this.http
      .get<Log>(environment.baseurl + '/logs/' + id, this.httpOptions)
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

  /**
   * Creates a new log entry.
   * @param data - The log input data.
   * @returns An Observable that emits a Log or LogIn object.
   */
  CreateLog(data: LogIn): Observable<Log | LogIn> {
    const log: LogIn = {
      objectId: data.objectId,
      operation: data.operation,
      component: data.component,
      message: data.message,
    }
    console.log('LogService.CreateLog: ' + JSON.stringify(log, null, ' '))
    return this.http
      .post<Log | LogIn>(`${environment.baseurl}/logs/`, log, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<LogIn>('CreateLog', log)))
  }

  /**
   * Updates a log entry.
   * @param id - The log ID.
   * @param data - The updated log data.
   * @returns An Observable that emits a Log object.
   */
  UpdateLog(id: string | null, data: JSON): Observable<Log | LogIn> {
    const sData = JSON.stringify(data, null, ' ')
    return this.http
      .put<Log | LogIn>(environment.baseurl + '/logs/' + id, sData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<LogIn>('UpdateLog', data as unknown as LogIn)))
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
      console.error(`LogService.handleErrorTemplate: ${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
