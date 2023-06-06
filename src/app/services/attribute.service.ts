import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { Attribute } from '../shared/attribute'
import { EnvironmentService } from './environment.service'
import { LogService } from './log.service'


@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  environmentService = new EnvironmentService()
  BASEURL = this.environmentService.get('BASEURL')
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private ngZone: NgZone,
    private router: Router,

  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  GetAttributes(): Observable<Attribute> {
    return this.http
      .get<Attribute>(this.BASEURL + '/attribute/')
      .pipe(retry(1), catchError(this.errorHandl))
  }
  GetAttribute(id: string | null): Observable<Attribute> {
    return this.http
      .get<Attribute>(
        this.BASEURL + '/attribute/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  DeleteAttribute(id: string): Observable<Attribute> {
    return this.http
      .delete<Attribute>(
        this.BASEURL + '/attribute/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  CreateAttribute(data: Attribute): Observable<Attribute> {
    return this.http
      .post<Attribute>(
        this.BASEURL + '/attribute/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl))
  }
  CloneAttribute(id: string): string {
    const id_uuid: string = uuidv4()
    this.GetAttribute(id).subscribe((value: Attribute) => {
      console.log('Get attribute: ' + JSON.stringify(value))
      value.id = id_uuid
      this.CreateAttribute(value).subscribe({
        next: (v) => {
          console.log('Create attribute: ' + JSON.stringify(v))
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list'))
        },
        complete: () =>
          this.ngZone.run(() => this.router.navigateByUrl('attribute-list')),
      })
    })
    return id_uuid
  }
  UpdateAttribute(id: string | null, data: Attribute): Observable<Attribute> {
    return this.http
      .put<Attribute>(
        this.BASEURL + '/attribute/' + id,
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
    return throwError(() => {
      return errorMessage
    })
  }
}
