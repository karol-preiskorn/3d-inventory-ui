import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { SyncRequestClient } from 'ts-sync-request'
import { v4 as uuidv4 } from 'uuid'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { Floor } from '../shared/floor'
import { Log, LogService } from './log.service'

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  baseurl = environment.baseurl
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router,
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  /**
   * Retrieves the list of floors.
   * @returns An Observable that emits an array of Floor objects.
   */
  GetFloors(): Observable<Floor[]> {
    return this.http.get<Floor[]>(environment.baseurl + '/floors/').pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Retrieves a floor synchronously by its ID.
   * @param id - The ID of the floor to retrieve.
   * @returns The floor object.
   */
  getFloorSynchronize(id: string | null): Floor {
    return new SyncRequestClient().get<Floor>(environment.baseurl + '/floors/' + id)
  }

  /**
   * Retrieves a floor by its ID.
   * @param id - The ID of the floor to retrieve.
   * @returns An Observable that emits the retrieved floor.
   */
  GetFloor(id: string): Observable<Floor> {
    return this.http
      .get<Floor>(environment.baseurl + '/floor/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Deletes a floor by its ID.
   * @param id - The ID of the floor to delete.
   * @returns An Observable that emits the deleted floor.
   */
  DeleteFloor(id: string): Observable<Floor> {
    return this.http
      .delete<Floor>(environment.baseurl + '/floor/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Creates a new floor.
   * @param data The floor data to be created.
   * @returns An Observable that emits the created floor.
   */
  CreateFloor(data: Floor): Observable<Floor> {
    return this.http
      .post<Floor>(environment.baseurl + '/floor/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Clones a floor by its ID.
   *
   * @param id - The ID of the floor to clone.
   * @returns The UUID of the cloned floor.
   */
  CloneFloor(id: string): string {
    const id_uuid: string = uuidv4.toString().substr(6, 36)
    this.GetFloor(id).subscribe((value: Floor) => {
      console.log('Get Floor: ' + JSON.stringify(value, null, ' '))
      value._id = id_uuid
      this.CreateFloor(value).subscribe({
        next: (v) => {
          console.log('Create Floor: ' + JSON.stringify(v, null, ' '))
          this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('floor-list')),
      })
    })
    return id_uuid
  }

  /**
   * Updates a floor with the specified ID.
   *
   * @param id - The ID of the floor to update.
   * @param data - The updated floor data.
   * @returns An Observable that emits the updated floor.
   */
  UpdateFloor(id: string, data: never): Observable<Floor> {
    return this.http
      .put<Floor>(environment.baseurl + '/floor/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Handles the error response from an API call.
   * @param error - The error object containing the error message and status.
   * @returns An Observable that emits the error message.
   */
  errorHandl(error: { error: { message: string }; status: unknown; message: Log }): Observable<never> {
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
}
