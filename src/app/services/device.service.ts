import { Observable, throwError } from 'rxjs'
import { catchError, map, retry } from 'rxjs/operators'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from '../../environments/environment'
import { Device } from '../shared/device'
import { Log, LogIn } from './log.service'

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  baseurl = environment.baseurl
  private readonly objectName = 'devices'

  constructor(private readonly http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    }),
  }

  GetDevices(): Observable<Device[]> {
    return this.http
      .get<Device[]>(environment.baseurl + '/' + this.objectName + '/')
      .pipe(retry(1), catchError(this.handleErrorTemplate<Device[]>('GetDevices')))
  }

  getDeviceSynchronize(id: string): Observable<Device> {
    return this.http.get<Device>(environment.baseurl + '/' + this.objectName + '/' + id)
  }

  GetDeviceSynchro(id: string): Observable<Device> {
    return this.http.get<Device>(environment.baseurl + '/' + this.objectName + '/' + id).pipe(
      map((res) => {
        return res
      }),
      catchError(this.handleErrorTemplate<Device>('GetDeviceSynchro', id as unknown as Device)),
    )
  }

  DeleteDevice(id: string): Observable<Device> {
    return this.http
      .delete<Device>(environment.baseurl + '/' + this.objectName + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Device>('DeleteDevice', id as unknown as Device)))
  }

  CreateDevice(data: Device): Observable<Device> {
    return this.http
      .post<Device>(environment.baseurl + '/' + this.objectName + '/', JSON.stringify(data, null, 2), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Device>('CreateDevice', data)))
  }

  CloneDevice(id: string): object {
    let result: Device = {
      _id: '',
      name: '',
      modelId: '',
      position: { x: 0, y: 0, h: 0 },
      isDebugMode: false,
    }
    this.getDeviceSynchronize(id).subscribe((value: Device) => {
      console.info('Get Device: ' + JSON.stringify(value, null, ' '))
      const deviceToCreate = value
      if (deviceToCreate._id !== undefined) {
        delete (deviceToCreate as { _id?: string })._id
      }
      console.info('Clone DeviceCreate: ' + JSON.stringify(deviceToCreate, null, ' '))
      deviceToCreate.name += ' (Clone)'
      this.CreateDevice(deviceToCreate).subscribe((createdDevice: Device) => {
        result = createdDevice
        console.info('Create Cloned Device: ' + JSON.stringify(createdDevice, null, ' '))
        const log: LogIn = {
          objectId: result._id,
          operation: 'Clone',
          component: 'Device',
          message: deviceToCreate,
        }
        console.log('LogService.CreateLog: ' + JSON.stringify(log, null, ' '))
        this.http
          .post<Log | LogIn>(`${environment.baseurl}/logs/`, log, this.httpOptions)
          .pipe(retry(1), catchError(this.handleErrorTemplate<LogIn>('CreateLog', log)))
          .subscribe()
      })
    })
    return result // Add this line to return the result
  }

  UpdateDevice(data: Device): Observable<Device> {
    console.log(
      'device.service.updateDevice: PUT ' +
        environment.baseurl +
        '/devices/' +
        data._id +
        '  ' +
        JSON.stringify(data, null, ' '),
    )
    const requestData = JSON.stringify(data, null, ' ')
    return this.http
      .put<Device>(environment.baseurl + '/devices/' + data._id, requestData, this.httpOptions)
      .pipe(catchError(this.handleErrorTemplate<Device>('updateDevice', data)))
  }

  postDevice(data: Device): Observable<Device> {
    return this.http
      .post<Device>(`${environment.baseurl}/devices`, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Device>('postDevice', data)))
  }

  private handleErrorTemplate<T>(operation: string, _result?: T) {
    return (error: Error): Observable<T> => {
      console.error(`DeviceService.handleErrorTemplate operation: ${operation}, error: ${error.message}`)
      return throwError(() => error)
    }
  }
}
