import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { AttributeDictionary } from '../shared/attributeDictionary'
import { LogService } from './log.service'
import { Router } from '@angular/router'
import * as dotenv from 'dotenv'
import { env } from 'node:process'

@Injectable({
  providedIn: 'root',
})
export class AttributeDictionaryService {
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router
  ) {
    dotenv.config()
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }
  GetAttributeDictionaries(): Observable<AttributeDictionary> {
    return this.http
      .get<AttributeDictionary>(env.BASEURL + '/attributes/')
      .pipe(retry(1), catchError(this.errorHandl))
  }
  GetAttributeDictionary(id: string | null): Observable<AttributeDictionary> {
    return this.http
      .get<AttributeDictionary>(
        env.BASEURL + '/attributes/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  DeleteAttributeDictionary(id: string): Observable<AttributeDictionary> {
    return this.http
      .delete<AttributeDictionary>(
        env.BASEURL + '/attributes/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  CreateAttributeDictionary(
    data: AttributeDictionary
  ): Observable<AttributeDictionary> {
    return this.http
      .post<AttributeDictionary>(
        env.BASEURL + '/attributes/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  CloneAttributeDictionary(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetAttributeDictionary(id).subscribe((value: AttributeDictionary) => {
      console.log('Get attributes: ' + JSON.stringify(value))
      value.id = id_uuid
      this.CreateAttributeDictionary(value).subscribe({
        next: (v) => {
          console.log('Create attributes: ' + JSON.stringify(v))
          this.ngZone.run(() => this.router.navigateByUrl('/attributes-list'))
        },
        complete: () =>
          this.ngZone.run(() => this.router.navigateByUrl('/attributes-list')),
      })
    })
    return id_uuid
  }
  UpdateAttributeDictionary(
    id: string | null,
    data: AttributeDictionary
  ): Observable<AttributeDictionary> {
    return this.http
      .put<AttributeDictionary>(
        env.BASEURL + '/attributes/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  errorHandl(error: { error: { message: string }; status: any; message: any }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage))
    return throwError(() => {
      return errorMessage
    })
  }
}
