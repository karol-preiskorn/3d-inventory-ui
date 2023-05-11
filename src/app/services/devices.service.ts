import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { Device } from '../shared/device'
import { LogService } from './log.service'
import { Router } from '@angular/router'
@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  baseurl = 'http://localhost:3000'

  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
  ) {}
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetDevices(): Observable<Device> {
    return this.http
      .get<Device>(this.baseurl + '/devices/')
      .pipe(retry(1), catchError(this.errorHandl))
  }

  GetDevice(id: string | null): Observable<Device> {
    return this.http
      .get<Device>(this.baseurl + '/devices/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  DeleteDevice(id: string): Observable<Device> {
    return this.http
      .delete<Device>(this.baseurl + '/devices/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  // POST
  CreateDevice(data: Device): Observable<Device> {
    return this.http
      .post<Device>(
        this.baseurl + '/devices/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CloneDevice(id: string): string {
    const id_uuid: string = uuidv4()
    const o = this.GetDevice(id).subscribe((value: Device) => {
      console.log('Get Device: ' + JSON.stringify(value))
      value.id = id_uuid
      this.CreateDevice(value).subscribe({
        next: (v) => {
          console.log('Create Device: ' + JSON.stringify(v))
          this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
        },
        complete: () =>
          this.ngZone.run(() => this.router.navigateByUrl('/devices-list')),
      })
    })
    return id_uuid
  }
  // PUT
  UpdateDevice(id: string | null, data: any): Observable<Device> {
    return this.http
      .put<Device>(
        this.baseurl + '/devices/' + id,
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
