import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { RouterModule } from '@angular/router'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  declarations: [],
  imports: [CommonModule, BrowserModule, ReactiveFormsModule, RouterModule, NgbPaginationModule],
  providers: [AppComponent],
})
export class AppModule {}
