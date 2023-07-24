import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Injectable, NgZone} from '@angular/core'
import {Router} from '@angular/router'
import {Observable, throwError, Subscription} from 'rxjs'
import {catchError, retry} from 'rxjs/operators'
import { SyncRequestClient } from 'ts-sync-request/dist'

import {EnvironmentService} from './environment.service'
import {LogService} from './log.service'

import {ComponentDictionary} from 'src/app/shared/component-dictionary'

import {AttributeDictionary} from 'src/app/shared/attribute-dictionary'
import {AttributeDictionaryService} from 'src/app/services/attribute-dictionary.service'

import {DeviceCategoryDict} from 'src/app/shared/deviceCategories'
import {DeviceTypeDict} from 'src/app/shared/deviceTypes'

import {Attribute} from 'src/app/shared/attribute'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import {Connection} from 'src/app/shared/connection'
import {ConnectionService} from 'src/app/services/connection.service'

import {v4 as uuidv4} from 'uuid'
import {Object3D} from 'three'

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  environmentService = new EnvironmentService()
  BASEURL = this.environmentService.getSettings('BASEURL')
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetAttributes(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(this.BASEURL + '/attributes/', this.httpOptions).pipe(retry(1), catchError(this.errorHandl))
  }

  GetDeviceAttributes(id: string): Observable<Attribute[]> {
    return this.http
      .get<Attribute[]>(this.BASEURL + '/attributes/?deviceId=' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  async GetDeviceAttributesPomise(id: string) {
    return this.http
      .get<Attribute[]>(this.BASEURL + '/attributes/?deviceId=' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl)).toPromise()
  }

  GetModelAtributes(id: string): Observable<Attribute[]> {
    return this.http
      .get<Attribute[]>(this.BASEURL + '/attributes/?modelId=' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  GetContextAttributes(component: string, item: string): Attribute[] {
    let attributes: Attribute[] = []
    let device: Device = new Device()
    device = JSON.parse(item)
    const url_model = this.BASEURL + '/attributes/?modelId=' + device.modelId
    const url_device = this.BASEURL + '/attributes/?deviceId=' + device.id
    attributes = new SyncRequestClient().get<Attribute[]>(url_model)
    attributes.push(...new SyncRequestClient().get<Attribute[]>(url_device))
    console.log('device.id: ' + device.id + ' ' + url_device)
    console.log('device.modelId: ' + device.modelId + ' ' + url_model)
    console.log('GetContextAttributes.attributes: ' + attributes)
    return attributes
  }

  GetAttribute(id: string | null): Observable<Attribute> {
    return this.http
      .get<Attribute>(this.BASEURL + '/attributes/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  DeleteAttribute(id: string): Observable<Attribute> {
    return this.http
      .delete<Attribute>(this.BASEURL + '/attributes/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CreateAttribute(data: Attribute): Observable<Attribute> {
    return this.http
      .post<Attribute>(this.BASEURL + '/attributes/', JSON.stringify(data), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CloneAttribute(id: string | null): string {
    const id_uuid: string = uuidv4()
    this.GetAttribute(id).subscribe((value: Attribute) => {
      console.log('Get attribute: ' + JSON.stringify(value))
      value.id = id_uuid
      this.CreateAttribute(value).subscribe({
        next: (v) => {
          console.log('Create attribute: ' + JSON.stringify(v))
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('attribute-list')),
      })
    })
    return id_uuid
  }

  UpdateAttribute(id: string | null, data: Attribute): Observable<Attribute> {
    return this.http
      .put<Attribute>(this.BASEURL + '/attributes/' + id, JSON.stringify(data), this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }

  errorHandl(error: {error: {message: string}; status: any; message: any}) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage))
    return throwError(() => {
      return errorMessage
    })
  }
}
