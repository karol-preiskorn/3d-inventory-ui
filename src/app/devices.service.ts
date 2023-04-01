import { Device } from './device'
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
  DeviceGet(): Observable<Device> {
    return this.http
      .get<Device>(this.baseurl + '/devices/')
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   *
   *
   * @param {{ id: string }} { id }
   * @return {*}  {Observable<Device>}
   * @memberof DevicesService
   */
  DeleteBug({ id }: { id: string }): Observable<Device> {
    return this.http
      .delete<Device>(this.baseurl + '/devices/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  add(device: Device) {
    this.devices.push(device)
  }

  clear() {
    this.devices = []
  }

  errorHandl(error: { error: { message: string }; status: any; message: ny }) {
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
