import { Observable, throwError } from 'rxjs'
import { catchError, map, retry } from 'rxjs/operators'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from '../../environments/environment'
import { Device } from '../shared/device'
import { Log, LogIn } from './log.service'
import { AuthenticationService } from './authentication.service'

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    timestamp: string
    version: string
  }
}

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  baseurl = environment.baseurl
  private readonly objectName = 'devices'

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthenticationService
  ) {}

  // Build consistent API URLs
  private buildUrl(path: string = ''): string {
    return `${environment.baseurl}/${this.objectName}${path}`
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  }

  // Get authenticated headers for write operations
  private getAuthenticatedOptions() {
    return {
      headers: this.authService.getAuthHeaders()
    }
  }

  GetDevices(): Observable<Device[]> {
    const url = this.buildUrl();
    console.warn('🚀 DeviceService: Calling API:', url);

    return this.http
      .get<ApiResponse<Device[]>>(url)
      .pipe(
        map(response => {
          console.warn('✅ DeviceService: API returned', response.data?.length || 0, 'devices');
          return response.data;
        }), // Extract data from API response
        retry(1),
        catchError((error) => {
          console.error('❌ DeviceService error:', error);
          return this.handleErrorTemplate<Device[]>('GetDevices')(error);
        })
      )
  }

  getDeviceSynchronize(id: string): Observable<Device> {
    return this.http
      .get<ApiResponse<Device>>(this.buildUrl(`/${id}`))
      .pipe(
        map(response => response.data) // Extract data from API response
      )
  }

  GetDeviceSynchro(id: string): Observable<Device> {
    return this.http
      .get<ApiResponse<Device>>(this.buildUrl(`/${id}`))
      .pipe(
        map(response => response.data), // Extract data from API response
        catchError(this.handleErrorTemplate<Device>('GetDeviceSynchro', id as unknown as Device))
      )
  }

  DeleteDevice(id: string): Observable<Device> {
    return this.http
      .delete<ApiResponse<Device>>(this.buildUrl(`/${id}`), this.getAuthenticatedOptions())
      .pipe(
        map(response => response.data), // Extract data from API response
        retry(1),
        catchError(this.handleErrorTemplate<Device>('DeleteDevice', id as unknown as Device))
      )
  }

  CreateDevice(data: Device): Observable<Device> {
    return this.http
      .post<Device>(this.buildUrl(), JSON.stringify(data, null, 2), this.getAuthenticatedOptions())
      .pipe(
        retry(1),
        catchError(this.handleErrorTemplate<Device>('CreateDevice', data))
      )
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
      const deviceToCreate = { ...value } // Create a copy
      if (deviceToCreate._id !== undefined) {
        delete (deviceToCreate as { _id?: string })._id
      }
      deviceToCreate.name += ' (Clone)'
      this.CreateDevice(deviceToCreate).subscribe((createdDevice: Device) => {
        result = createdDevice
        const log: LogIn = {
          objectId: result._id,
          operation: 'Clone',
          component: 'Device',
          // Serialize cloned device to comply with LogIn.message: string
          message: JSON.stringify(deviceToCreate),
        }
        this.http
          .post<ApiResponse<Log | LogIn>>(`${environment.baseurl}/logs`, log, this.httpOptions)
          .pipe(
            map(response => response.data), // Extract data from API response
            retry(1),
            catchError(this.handleErrorTemplate<LogIn>('CreateLog', log))
          )
          .subscribe()
      })
    })
    return result
  }

  UpdateDevice(data: Device): Observable<Device> {
    const requestData = JSON.stringify(data, null, ' ')
    return this.http
      .put<ApiResponse<Device>>(this.buildUrl(`/${data._id}`), requestData, this.getAuthenticatedOptions())
      .pipe(
        map(response => response.data), // Extract data from API response
        catchError(this.handleErrorTemplate<Device>('updateDevice', data))
      )
  }

  postDevice(data: Device): Observable<Device> {
    return this.http
      .post<ApiResponse<Device>>(this.buildUrl(), JSON.stringify(data, null, ' '), this.getAuthenticatedOptions())
      .pipe(
        map(response => response.data), // Extract data from API response
        retry(1),
        catchError(this.handleErrorTemplate<Device>('postDevice', data))
      )
  }

  private handleErrorTemplate<T>(operation: string, _result?: T) {
    return (error: Error): Observable<T> => {
      console.error(`DeviceService.handleErrorTemplate operation: ${operation}, error: ${error.message}`)
      return throwError(() => error)
    }
  }
}
