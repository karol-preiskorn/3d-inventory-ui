import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'; // Import the uuidv4 function
import { environment } from '../../environments/environment'
import { Connection } from '../shared/connection'
import { LogService } from './log.service'

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  baseurl = environment.baseurl

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router,
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  }

  /**
   * Retrieves the connections.
   * @returns An Observable of type Connection.
   */
  GetConnections(): Observable<Connection[]> {
    return this.http
      .get<Connection[]>(environment.baseurl + '/connections/')
      .pipe(retry(1), catchError(this.handleErrorTemplate<Connection[]>('GetConnections')))
  }

  /**
   * Retrieves a connection by its ID.
   * @param id The ID of the connection to retrieve.
   * @returns An Observable that emits the retrieved Connection object.
   */
  GetConnection(id: string): Observable<Connection> {
    return this.http
      .get<Connection>(environment.baseurl + '/connections/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Connection>('GetConnection')))
  }

  /**
   * Deletes a connection by its ID.
   * @param id The ID of the connection to delete.
   * @returns An Observable that emits the deleted Connection object.
   */
  DeleteConnection(id: string): Observable<Connection> {
    return this.http
      .delete<Connection>(environment.baseurl + '/connections/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Connection>('DeleteConnection')))
  }

  /**
   * Creates a connection.
   * @param data The connection data to be created.
   * @returns An observable that emits the created connection.
   */
  CreateConnection(data: Connection): Observable<Connection> {
    return this.http
      .post<Connection>(environment.baseurl + '/connections/', JSON.stringify(data), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Connection>('CreateConnection', data)))
  }

  /**
   * Clones a connection with the specified ID.
   *
   * @param id - The ID of the connection to clone.
   * @returns The UUID of the cloned connection.
   */
  CloneConnection(id: string): string {
    const id_uuid = uuidv4().toString().substr(6, 36) // Call the uuidv4 function
    this.GetConnection(id).subscribe((value: Connection) => {
      // console.log('Get Connections: ' + JSON.stringify(value))
      value._id = id_uuid
      this.CreateConnection(value).subscribe({
        next: (_v) => {
          // console.log('Create Connections: ' + JSON.stringify(v))
          this.ngZone.run(() => this.router.navigateByUrl('connections-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('connections-list')),
      })
    })
    return id_uuid
  }

  /**
   * Updates a connection with the specified ID.
   * @param {ObjectId} id - The ID of the connection to update.
   * @param {Connection} data - The updated connection data.
   * @returns {Observable<Connection>} An observable that emits the updated connection.
   */
  UpdateConnection(id: string, data: Connection): Observable<Connection> {
    return this.http
      .put<Connection>(environment.baseurl + '/connections/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Connection>('UpdateConnection', data)))
  }

  /**
   * Handles the error response from the server.
   * @param error - The error object containing the error message and status.
   * @returns - An Observable that emits the error message.
   */
  errorHandl(error: { error: { message: string }; status: number; message: string }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.error(JSON.stringify(errorMessage))

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
      console.error(`DeviceService.handleErrorTemplate operation: ${operation}, error: ${error.message}`)
      return of(result as T)
    }
  }
}
