import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { Floors } from '../shared/floors'
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
   * @returns An Observable that emits an array of Floors objects.
   */
  GetFloors(): Observable<Floors[]> {
    return this.http.get<Floors[]>(environment.baseurl + '/floors/').pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Retrieves a Floors by its ID as an Observable.
   * @param id - The ID of the Floors to retrieve.
   * @returns An Observable that emits the Floors object.
   */
  getFloorSynchronize(id: string | null): Observable<Floors> {
    return this.http.get<Floors>(environment.baseurl + '/floors/' + id)
  }

  /**
   * Retrieves a Floors by its ID.
   * @param id - The ID of the Floors to retrieve.
   * @returns An Observable that emits the retrieved Floors.
   */
  GetFloor(id: string): Observable<Floors> {
    return this.http
      .get<Floors>(environment.baseurl + '/floors/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Deletes a Floors by its ID.
   * @param id - The ID of the Floors to delete.
   * @returns An Observable that emits the deleted Floors.
   */
  DeleteFloor(id: string): Observable<Floors> {
    return this.http
      .delete<Floors>(environment.baseurl + '/floors/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Creates a new Floors.
   * @param data The Floors data to be created.
   * @returns An Observable that emits the created Floors.
   */
  CreateFloor(data: Floors): Observable<Floors> {
    return this.http
      .post<Floors>(environment.baseurl + '/floors/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Clones a Floors by its ID.
   * @param id - The ID of the Floors to clone.
   * @returns An Observable that emits the cloned Floors's ID.
   */
  CloneFloor(id: string): Observable<string> {
    const newId = uuidv4()
    return new Observable<string>((observer) => {
      this.GetFloor(id).subscribe({
        next: (Floors: Floors) => {
          const clonedFloor = { ...Floors, _id: newId }
          this.CreateFloor(clonedFloor).subscribe({
            next: () => {
              this.ngZone.run(() => this.router.navigateByUrl('Floors-list'))
              observer.next(newId)
              observer.complete()
            },
            error: (err) => observer.error(err),
          })
        },
        error: (err) => observer.error(err),
      })
    })
  }

  /**
   * Updates a Floors with the specified ID.
   * @param id - The ID of the Floors to update.
   * @param data - The updated Floors data.
   * @returns An Observable that emits the updated Floors.
   */
  UpdateFloor(id: string, data: Floors): Observable<Floors> {
    return this.http
      .put<Floors>(`${environment.baseurl}/floors/${id}`, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Handles the error response from an API call.
   * @param error - The error object containing the error message and status.
   * @returns An Observable that emits the error message.
   */
  errorHandl(error: any): Observable<never> {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`
    }
    console.error(errorMessage)
    return throwError(() => new Error(errorMessage))
  }
}
