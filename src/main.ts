import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { enableProdMode } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { routes } from './app/app-routing.module'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'

const credentialsInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Add credentials to all requests
  const credentialsReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(credentialsReq);
};

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor])
    )
  ],
}).catch((err: unknown) => console.error(err))
