import { Device } from '../shared/device'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { retry, catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  baseurl = 'http://localhost:3000'

  devices: Device[] = []

  constructor(private http: HttpClient) {}
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  /**
   *
   *
   * @return {*}  {Observable<Device>}
   * @memberof DevicesService
   */
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

  /**
   *
   *
   * @param {{ id: string }} { id }
   * @return {*}  {Observable<Device>}
   * @memberof DevicesService
   */
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

  add(device: Device) {
    this.devices.push(device)
  }

  clear() {
    this.devices = []
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
    console.log(errorMessage)
    return throwError(() => {
      return errorMessage
    })
  }
}
