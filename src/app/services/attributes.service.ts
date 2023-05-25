import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { Attribute } from '../shared/attribute'
import { LogService } from './log.service'
import { Router } from '@angular/router'
import * as dotenv from 'dotenv'

@Injectable({
  providedIn: 'root',
})
export class AttributesService {
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

  GetAttributes(): Observable<Attribute> {
    return this.http
      .get<Attribute>(process.env.BASEURL + '/attributes/')
      .pipe(retry(1), catchError(this.errorHandl))
  }

  GetAttribute(id: string | null): Observable<Attribute> {
    return this.http
      .get<Attribute>(
        process.env.BASEURL + '/attributes/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  DeleteAttributes(id: string): Observable<Attribute> {
    return this.http
      .delete<Attribute>(
        process.env.BASEURL + '/attributes/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  // POST
  CreateAttributes(data: Attribute): Observable<Attribute> {
    return this.http
      .post<Attribute>(
        process.env.BASEURL + '/attributes/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  CloneAttributes(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetAttribute(id).subscribe((value: Attribute) => {
      console.log('Get attributes: ' + JSON.stringify(value))
      value.id = id_uuid
      this.CreateAttributes(value).subscribe({
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
  // PUT
  UpdateAttributes(id: string | null, data: Attribute): Observable<Attribute> {
    return this.http
      .put<Attribute>(
        process.env.BASEURL + '/attributes/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }

  errorHandl(error: { error: { message: string }; status: any; message: any }) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.log(JSON.stringify(errorMessage))
    // logService.CreateLog({
    //   message: 'Error service attributes: ' + JSON.stringify(error.message),
    //   category: 'Error',
    //   component: 'attributeservice.errorHandl',
    // })

    return throwError(() => {
      return errorMessage
    })
  }
}
