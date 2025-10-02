import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import { enableProdMode } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { routes } from './app/app-routing.module'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'

const credentialsInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Add credentials to all requests while preserving existing headers
  const headers: { [key: string]: string } = {}

  // Only add Content-Type if not already present
  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json'
  }

  // Only add Accept if not already present
  if (!req.headers.has('Accept')) {
    headers['Accept'] = 'application/json'
  }

  // Clone request with additional headers (preserving existing ones)
  const credentialsReq = req.clone({
    setHeaders: headers
  })

  return next(credentialsReq)
}

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor]))],
}).catch((err: unknown) => console.error(err))
