import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { DeviceService } from 'src/app/services/device.service'
import { ModelsService } from 'src/app/services/models.service'
import { Attribute } from 'src/app/shared/attribute'
import { Device } from 'src/app/shared/device'
import { SyncRequestClient } from 'ts-sync-request/dist'
import { environment } from '../../environments/environment'
import { LogService } from './log.service'


import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  baseurl = environment.baseurl
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetAttributes(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(environment.baseurl + '/attributes/', this.httpOptions).pipe(retry(1), catchError(this.errorHandl))
  }

  GetAttributesSync(): Attribute[] {
    let attributes: Attribute[] = []
    const url = environment.baseurl + '/attributes/'
    attributes = new SyncRequestClient().get<Attribute[]>(url)
    console.log('GetAttributesSync.attributes: ' + JSON.stringify(attributes, null, ' '))
    return attributes
  }

  GetDeviceAttributes(id: string): Observable<Attribute[]> {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/?deviceId=' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  async GetDeviceAttributesPromise(id: string) {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/?deviceId=' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl)).toPromise()
  }

  GetModelAtributes(id: string): Observable<Attribute[]> {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/?modelId=' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  GetContextAttributes(component: string, item: string): Attribute[] {
    let attributes: Attribute[] = []
    let device: Device = new Device()
    device = JSON.parse(item)
    const url_model = environment.baseurl + '/attributes/?modelId=' + device.modelId
    const url_device = environment.baseurl + '/attributes/?deviceId=' + device.id
    attributes = new SyncRequestClient().get<Attribute[]>(url_model)
    attributes.push(...new SyncRequestClient().get<Attribute[]>(url_device))
    console.log('device.id: ' + device.id + ' ' + url_device)
    console.log('device.modelId: ' + device.modelId + ' ' + url_model)
    console.log('GetContextAttributes.attributes: ' + attributes)
    return attributes
  }

  GetAttribute(id: string | null): Observable<Attribute> {
    return this.http
      .get<Attribute>(environment.baseurl + '/attributes/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  DeleteAttribute(id: string): Observable<Attribute> {
    return this.http
      .delete<Attribute>(environment.baseurl + '/attributes/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CreateAttribute(data: Attribute): Observable<Attribute> {
    return this.http
      .post<Attribute>(environment.baseurl + '/attributes/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CloneAttribute(id: string | null): string {
    const id_uuid: string = uuidv4()
    this.GetAttribute(id).subscribe((value: Attribute) => {
      console.log('Get attribute: ' + JSON.stringify(value, null, ' '))
      value.id = id_uuid
      this.CreateAttribute(value).subscribe({
        next: (v) => {
          console.log('Create attribute: ' + JSON.stringify(v, null, ' '))
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('attribute-list')),
      })
    })
    return id_uuid
  }

  UpdateAttribute(id: string | null, data: Attribute): Observable<Attribute> {
    return this.http
      .put<Attribute>(environment.baseurl + '/attributes/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  errorHandl(error: { error: { message: string }; status: number; message: string }) {
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
