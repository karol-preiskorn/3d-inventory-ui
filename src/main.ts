import { routes } from './app/app-routing.module'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'
import { enableProdMode } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'

// Add HTTP interceptor for credentials and error handling
import { HttpInterceptorFn } from '@angular/common/http'

const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
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
