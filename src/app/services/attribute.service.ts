import { Observable, of, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { DeviceService } from 'src/app/services/device.service'
import { ModelsService } from 'src/app/services/models.service'
import { Attribute } from 'src/app/shared/attribute'
import { Device } from 'src/app/shared/device'
import { SyncRequestClient } from 'ts-sync-request/dist'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { LogService } from './log.service'

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
    private router: Router,
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  /**
   * Retrieves the attributes from the server.
   * @returns An Observable that emits an array of Attribute objects.
   */
  GetAttributes(): Observable<Attribute[]> {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleErrorTemplate<Attribute[]>('GetDeviceAttributes', null as unknown as Attribute[])),
      )
  }

  /**
   * Retrieves the attributes synchronously.
   * @returns An array of attributes.
   */
  GetAttributesSync(): Attribute[] {
    let attributes: Attribute[] = []
    const url = environment.baseurl + '/attributes/'
    attributes = new SyncRequestClient().get<Attribute[]>(url)
    console.log('GetAttributesSync.attributes: ' + JSON.stringify(attributes, null, ' '))
    return attributes
  }

  /**
   * Retrieves the attributes of a device.
   * @param id The ID of the device.
   * @returns An Observable that emits an array of Attribute objects.
   */
  GetDeviceAttributes(id: string): Observable<Attribute | Attribute[]> {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/device/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleErrorTemplate<Attribute>('GetDeviceAttributes', id as unknown as Attribute)),
      )
  }

  /**
   * Retrieves the attributes of a device using a Promise.
   * @param id The ID of the device.
   * @returns A Promise that resolves to an array of Attribute objects.
   */
  async GetDeviceAttributesPromise(id: string) {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/device/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleErrorTemplate<Attribute>('GetDeviceAttributesPromise', id as unknown as Attribute)),
      )
      .toPromise()
  }

  /**
   * Retrieves the attributes for a given model ID.
   * @param id The ID of the model.
   * @returns An Observable that emits an array of Attribute objects.
   */
  GetModelAttributes(id: string): Observable<Attribute | Attribute[]> {
    return this.http
      .get<Attribute[]>(environment.baseurl + '/attributes/model/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Attribute>('GetModelAttributes', id as unknown as Attribute)))
  }

  /**
   * Retrieves the context attributes for a given component and item.
   * @param component - The component name.
   * @param item - The item in JSON format.
   * @returns An array of Attribute objects representing the context attributes.
   */
  GetContextAttributes(component: string, item: string): Attribute[] {
    let attributes: Attribute[] = []
    let device: Device = new Device()
    console.warn('JSON.parse(item): ' + item)
    try {
      device = JSON.parse(item) as Device
    } catch (error) {
      console.error('JSON.parse(item): ' + item + ' ' + error)
    }
    const url_model = environment.baseurl + '/attributes/model/' + device.modelId
    const url_device = environment.baseurl + '/attributes/device/' + device._id
    try {
      attributes = new SyncRequestClient().get<Attribute[]>(url_model)
    } catch (error) {
      console.error('SyncRequestClient().get<Attribute[]>: ' + url_model + ' ' + error)
    }
    try {
      attributes.push(...new SyncRequestClient().get<Attribute[]>(url_device))
    } catch (error) {
      console.error('SyncRequestClient().get<Attribute[]>: ' + url_device + ' ' + error)
    }
    console.log('device.id: ' + device._id + ' ' + url_device)
    console.log('device.modelId: ' + device.modelId + ' ' + url_model)
    console.log('GetContextAttributes.attributes: ' + attributes)
    return attributes
  }

  /**
   * Retrieves an attribute by its ID.
   * @param id The ID of the attribute to retrieve.
   * @returns An Observable that emits the retrieved attribute.
   */
  GetAttribute(id: string): Observable<Attribute> {
    return this.http
      .get<Attribute>(environment.baseurl + '/attributes/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Attribute>('DeleteAttribute', id as unknown as Attribute)))
  }

  /**
   * Deletes an attribute by its ID.
   * @param id The ID of the attribute to delete.
   * @returns An Observable that emits the deleted attribute.
   */
  DeleteAttribute(id: string): Observable<Attribute> {
    return this.http
      .delete<Attribute>(environment.baseurl + '/attributes/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Attribute>('DeleteAttribute', id as unknown as Attribute)))
  }

  /**
   * Creates a new attribute.
   * @param data The attribute data to be created.
   * @returns An observable that emits the created attribute.
   */
  CreateAttribute(data: Attribute): Observable<Attribute> {
    return this.http
      .post<Attribute>(environment.baseurl + '/attributes/', JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Attribute>('CreateAttribute', data)))
  }

  /**
   * Clones an attribute with the specified ID.
   *
   * @param id - The ID of the attribute to clone.
   * @returns The UUID of the cloned attribute.
   */
  CloneAttribute(id: string): string {
    this.GetAttribute(id).subscribe((value: Attribute) => {
      console.log('Get attribute: ' + JSON.stringify(value, null, ' '))
      this.CreateAttribute(value).subscribe({
        next: (v) => {
          console.log('Create attribute: ' + JSON.stringify(v, null, ' '))
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('attribute-list')),
      })
    })
    return ''
  }

  /**
   * Updates an attribute with the specified ID.
   * @param id - The ID of the attribute to update.
   * @param data - The updated attribute data.
   * @returns An Observable that emits the updated attribute.
   */
  UpdateAttribute(id: string, data: Attribute): Observable<Attribute> {
    return this.http
      .put<Attribute>(environment.baseurl + '/attributes/' + id, JSON.stringify(data, null, ' '), this.httpOptions)
      .pipe(retry(1), catchError(this.handleErrorTemplate<Attribute>('UpdateModel', data)))
  }

  /**
   * Handles the error response from the server.
   * @param error - The error object containing the error message and status.
   * @returns An Observable that emits the error message.
   */
  errorHandl(error: { error: { message: string }; status: number; message: string }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage, null, ' '))
    return throwError(() => {
      return errorMessage
    })
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleErrorTemplate<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(`attribute.service.handleErrorTemplate: ${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
