import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { environment } from '../../environments/environment'
import { AttributeDictionary } from '../shared/attribute-dictionary'
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
    }),
  }
  /**
   * Retrieves the attribute dictionaries.
   * @returns An observable that emits the attribute dictionaries.
   */
  GetAttributeDictionaries(): Observable<AttributeDictionary[]> {
    return this.http
      .get<AttributeDictionary[]>(environment.baseurl + '/attributesDictionary/')
      .pipe(retry(1), catchError(this.errorHandl))
  }

  /**
   * Retrieves an attribute dictionary by its ID.
   * @param id - The ID of the attribute dictionary to retrieve.
   * @returns An Observable that emits the retrieved AttributeDictionary.
   */
  GetAttributeDictionary(id: string | null): Observable<AttributeDictionary> {
    return this.http
      .get<AttributeDictionary>(environment.baseurl + '/attribute-dictionary/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }
  /**
   * Deletes an attribute dictionary with the specified ID.
   * @param id The ID of the attribute dictionary to delete.
   * @returns An Observable that emits the deleted attribute dictionary.
   */
  DeleteAttributeDictionary(id: string): Observable<AttributeDictionary> {
    return this.http
      .delete<AttributeDictionary>(environment.baseurl + '/attributesDictionary/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl))
  }
  /**
   * Creates an attribute dictionary.
   * @param data The attribute dictionary data to be created.
   * @returns An observable that emits the created attribute dictionary.
   */
  CreateAttributeDictionary(data: AttributeDictionary): Observable<AttributeDictionary> {
    return this.http
      .post<AttributeDictionary>(
        environment.baseurl + '/attributesDictionary/',
        JSON.stringify(data, null, ' '),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  /**
   * Clones an attribute dictionary with the specified ID.
   *
   * @param id - The ID of the attribute dictionary to clone.
   * @returns The UUID of the cloned attribute dictionary.
   */
  CloneAttributeDictionary(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetAttributeDictionary(id).subscribe((value: AttributeDictionary) => {
      console.log('Get attributes: ' + JSON.stringify(value, null, ' '))
      value._id = id_uuid
      this.CreateAttributeDictionary(value).subscribe({
        next: (v) => {
          console.log('Create attributes: ' + JSON.stringify(v, null, ' '))
          this.ngZone.run(() => this.router.navigateByUrl('attributesDictionary-list'))
        },
        complete: () => this.ngZone.run(() => this.router.navigateByUrl('attribute-dictionary-list')),
      })
    })
    return id_uuid
  }
  /**
   * Updates an attribute dictionary with the specified ID.
   * @param id - The ID of the attribute dictionary to update.
   * @param data - The updated attribute dictionary data.
   * @returns An observable that emits the updated attribute dictionary.
   */
  UpdateAttributeDictionary(id: string | null, data: AttributeDictionary): Observable<AttributeDictionary> {
    return this.http
      .put<AttributeDictionary>(
        environment.baseurl + '/attributesDictionary/' + id,
        JSON.stringify(data, null, ' '),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  /**
   * Handles the error response from an HTTP request.
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
}
