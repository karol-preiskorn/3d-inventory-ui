import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Injectable, NgZone} from '@angular/core'
import {Router} from '@angular/router'
import {Observable, throwError} from 'rxjs'
import {catchError, retry} from 'rxjs/operators'
import {v4 as uuidv4} from 'uuid'
import {SyncRequestClient} from 'ts-sync-request'

import {Floor} from '../shared/floor'
import {EnvironmentService} from './environment.service'
import {Log, LogService} from './log.service'

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  environmentServiceClass = new EnvironmentService()
  BASEURL = this.environmentServiceClass.getSettings('BASEURL')
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetFloors(): Observable<Floor[]> {
    return this.http.get<Floor[]>(this.BASEURL + '/floor/').pipe(retry(1), catchError(this.errorHandl))
  }

  getFloorSynchronize(id: string | null): Floor {
    return new SyncRequestClient().get<Floor>(this.BASEURL + '/floor/' + id)
  }

  GetFloor(id: string | null): Observable<Floor> {
    return this.http
      .get<Floor>(this.BASEURL + '/floor/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  DeleteFloor(id: string): Observable<Floor> {
    return this.http
      .delete<Floor>(this.BASEURL + '/floor/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CreateFloor(data: Floor): Observable<Floor> {
    return this.http
      .post<Floor>(this.BASEURL + '/floor/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CloneFloor(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetFloor(id).subscribe((value: Floor) => {
      console.log('Get Floor: ' + JSON.stringify(value, null, ' '))
      value.id = id_uuid
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

  UpdateFloor(
    id: string | null | undefined,
    data: never
  ): Observable<Floor> {
    return this.http
      .put<Floor>(this.BASEURL + '/floor/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }


  errorHandl(error: {error: {message: string}; status: any; message: Log}) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage, null, ' '))
    return throwError(() => {
      return errorMessage
    })
  }
}
