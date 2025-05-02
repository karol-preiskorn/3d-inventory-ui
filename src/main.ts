import '@angular/localize/init' // Add this line at the top
import { routes } from './app/app-routing.module'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'
import { enableProdMode } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'

// if (environment.production) {
//   enableProdMode()
// }

bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient()] }).catch((err: unknown) =>
  console.error(err),
)
