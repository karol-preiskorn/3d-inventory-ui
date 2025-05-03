import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { RouterModule, Resolve } from '@angular/router'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { ResolverDevice } from './resolverDevice'
import { ResolverModel } from './resolverModel'

@NgModule({
  declarations: [],
  imports: [CommonModule, BrowserModule, ReactiveFormsModule, RouterModule, NgbPaginationModule],
  providers: [AppComponent, ResolverDevice, ResolverModel],
})
export class AppModule {}
