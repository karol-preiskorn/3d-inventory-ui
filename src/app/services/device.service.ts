import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError, map, retry } from 'rxjs/operators'
import { SyncRequestClient } from 'ts-sync-request/dist'
import { v4 as uuidv4 } from 'uuid'

import { Device } from '../shared/device'
import { LogService } from './log.service'


@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private baseurl = 'http://localhost:3000'
  private objectName = 'devices'

  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetDevices(): Observable<Device> {
    return this.http
      .get<Device>(this.baseurl + '/' + this.objectName + '/')
      .pipe(retry(1), catchError(this.errorHandl))
  }

  GetDevice(id: string | null): Observable<Device> {
    return this.http
      .get<Device>(this.baseurl + '/' + this.objectName + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }


  getDeviceSynchronize(id: string | null) {
    return new SyncRequestClient().get<Device>(this.baseurl + '/' + this.objectName + '/' + id)
  }

  GetDeviceSynchro(id: string | null): Observable<Device> {
    return this.http
      .get<Device>(this.baseurl + '/' + this.objectName + '/' + id).pipe(
        map(res => {
          return res
        }),
        catchError(this.errorHandl)
      )
  }

  DeleteDevice(id: string | null): Observable<Device> {
    return this.http
      .delete<Device>(this.baseurl + '/' + this.objectName + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CreateDevice(data: Device): Observable<Device> {
    return this.http
      .post<Device>(
        this.baseurl + '/' + this.objectName + '/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CloneDevice(id: string | null): string {
    const id_uuid: string = uuidv4()
    this.GetDevice(id).subscribe((value: Device) => {
      console.log('Get Device: ' + JSON.stringify(value))
      value.id = id_uuid
      this.CreateDevice(value).subscribe({
        next: (v) => {
          console.log('Create Device: ' + JSON.stringify(v))
          this.ngZone.run(() => this.router.navigateByUrl('device-list'))
        },
        complete: () =>
          this.ngZone.run(() => this.router.navigateByUrl('device-list')),
      })
    })
    return id_uuid
  }
  
  // PUT
  UpdateDevice(id: string | null, data: any): Observable<Device> {
    return this.http
      .put<Device>(
        this.baseurl + '/' + this.objectName + '/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  errorHandl(error: { error: { message: string }; status: any; message: any }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage))
    // logService.CreateLog({
    //   message: 'Error service device: ' + JSON.stringify(error.message),
    //   category: 'Error',
    //   component: 'DeviceService.errorHandl',
    // })

    return throwError(() => {
      return errorMessage
    })
  }
}
