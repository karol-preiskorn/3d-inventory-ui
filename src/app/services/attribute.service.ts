import { Observable, of, throwError, firstValueFrom } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { Attribute } from '../shared/attribute'
import { Device } from '../shared/device'
import { DeviceService } from './device.service'
import { LogService } from './log.service'
import { ModelsService } from './models.service'

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
   * Retrieves the attributes asynchronously.
   * @returns A promise that resolves to an array of attributes.
   */
  async GetAttributesSync(): Promise<Attribute[]> {
    const url = `${environment.baseurl}/attributes/`
    try {
      const attributes = await firstValueFrom(
        this.http.get<Attribute[]>(url, this.httpOptions).pipe(
          retry(1),
          catchError(() => of([] as Attribute[])),
        ),
      )
      return attributes ?? []
    } catch (error) {
      console.error('GetAttributesSync error:', error)
      return []
    }
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
  async GetContextAttributes(component: string, item: string): Promise<Attribute[]> {
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
      attributes = await firstValueFrom(
        this.http.get<Attribute[]>(url_model, this.httpOptions).pipe(
          retry(1),
          catchError(() => of([] as Attribute[])),
        ),
      )
    } catch (error) {
      console.error('SyncRequestClient().get<Attribute[]>: ' + url_model + ' ' + error)
    }
    try {
      attributes.push(
        ...(await firstValueFrom(
          this.http.get<Attribute[]>(url_device, this.httpOptions).pipe(
            retry(1),
            catchError(() => of([] as Attribute[])),
          ),
        )),
      )
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
      .post<Attribute>(environment.baseurl + '/attributes/', JSON.stringify(data), this.httpOptions)
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
    console.error(`attribute.service.errorHandl: Error Code: ${error.status}, Message: ${error.message}`)
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
    return (error: HttpErrorResponse): Observable<T> => {
      if (result === undefined || result === null) {
        console.warn(`attribute.service.handleErrorTemplate: ${operation} returned a null or undefined result.`)
      }
      return of(result as T)
    }
  }
}
