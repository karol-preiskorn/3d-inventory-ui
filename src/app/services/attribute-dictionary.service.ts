import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'
import { AttributesDictionary } from '../shared/AttributesDictionary'
import { LogService } from './log.service'

@Injectable({
  providedIn: 'root',
})
export class AttributeDictionaryService {
  baseurl = environment.baseurl
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router,
  ) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    }),
  }
  /**
   * Retrieves the attribute dictionaries.
   * @returns An observable that emits the attribute dictionaries.
   */
  GetAttributeDictionaries(): Observable<AttributesDictionary[]> {
    return this.http
      .get<AttributesDictionary[]>(environment.baseurl + '/attributesDictionary/')
      .pipe(retry(1), catchError(this.errorHandler))
  }

  /**
   * Retrieves an attribute dictionary by its ID.
   * @param id The ID of the attribute dictionary to retrieve.
   * @returns An Observable emitting the retrieved AttributesDictionary.
   */
  GetAttributeDictionary(id: string): Observable<AttributesDictionary> {
    if (!id) {
      return throwError(() => new Error('Attribute dictionary ID is required.'))
    }
    const url = `${environment.baseurl}/attributesDictionary/${encodeURIComponent(id)}`
    return this.http.get<AttributesDictionary>(url, this.httpOptions).pipe(retry(1), catchError(this.errorHandler))
  }

  /**
   * Deletes an attribute dictionary by its ID.
   * @param id - The ID of the attribute dictionary to delete.
   * @returns An Observable emitting the deleted AttributesDictionary.
   */
  DeleteAttributeDictionary(id: string): Observable<AttributesDictionary> {
    if (!id) {
      return throwError(() => new Error('Attribute dictionary ID is required for deletion.'))
    }
    const url = `${environment.baseurl}/attributesDictionary/${encodeURIComponent(id)}`
    return this.http.delete<AttributesDictionary>(url, this.httpOptions).pipe(retry(1), catchError(this.errorHandler))
  }

  /**
   * Creates a new attribute dictionary.
   * @param data The attribute dictionary data to create.
   * @returns An Observable emitting the created AttributesDictionary.
   */
  /**
   * Creates a new attribute dictionary.
   * @param data - The attribute dictionary data to create.
   * @returns An Observable emitting the created AttributesDictionary.
   */
  CreateAttributeDictionary(data: Omit<AttributesDictionary, '_id'>): Observable<AttributesDictionary> {
    if (!data || !data.name || !data.type || !data.componentName) {
      return throwError(() => new Error('Missing required attribute dictionary fields.'));
    }
    return this.http
      .post<AttributesDictionary>(`${this.baseurl}/attributesDictionary/`, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  /**
   * Clones an attribute dictionary by its ID and navigates to the list view upon success.
   * @param id - The ID of the attribute dictionary to clone.
   * @returns An Observable emitting the cloned attribute dictionary.
   */
  CloneAttributeDictionary(id: string): Observable<AttributesDictionary> {
    return new Observable<AttributesDictionary>((observer) => {
      this.GetAttributeDictionary(id).subscribe({
        next: (original) => {
          // Remove _id to let backend generate a new one
          const { _id, ...cloneData } = original
          this.CreateAttributeDictionary(cloneData as AttributesDictionary).subscribe({
            next: (created) => {
              this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list'))
              observer.next(created)
              observer.complete()
            },
            error: (err) => observer.error(err),
          })
        },
        error: (err) => observer.error(err),
      })
    })
  }

  /**
   * Updates an attribute dictionary by its ID.
   * @param id - The ID of the attribute dictionary to update.
   * @param data - The updated attribute dictionary data.
   * @returns An Observable emitting the updated attribute dictionary.
   */
  UpdateAttributeDictionary(id: string, data: AttributesDictionary): Observable<AttributesDictionary> {
    if (!id) {
      return throwError(() => new Error('Attribute dictionary ID is required for update.'))
    }
    return this.http
      .put<AttributesDictionary>(`${environment.baseurl}/attributesDictionary/${id}`, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandler))
  }

  /**
   * Handles the error response from an HTTP request.
   * @param error - The error object containing the error message and status.
   * @returns An Observable that emits the error message.
   */
  private errorHandler(error: any) {
    let errorMessage: string
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      const detailedMessage = error.message || error.error?.message || 'Unknown error'
      errorMessage = `Error Code: ${error.status} | Message: ${detailedMessage}`
    }
    console.error(errorMessage)
    return throwError(() => new Error(errorMessage))
  }
}
