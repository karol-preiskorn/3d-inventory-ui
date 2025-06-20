import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  public myTheme: string = 'light'

  ngOnInit() {
    this.myTheme = localStorage.getItem('theme') ?? 'light'
    this.changeTheme(this.myTheme)
  }

  themeSwitch() {
    if (this.myTheme === 'light') {
      console.log('theme dark')
      this.myTheme = 'dark'
    } else {
      console.log('theme light')
      this.myTheme = 'light'
    }
  }

  currentYearLong(): number {
    return new Date().getFullYear()
  }

  changeTheme(theme: string) {
    const body = document.body
    body.setAttribute('data-bs-theme', theme)
  }

  public handleKeyDown(event: KeyboardEvent): void {
    // Add your logic here, for example:
    console.log('Key pressed:', event.key)
  }

  public openLink(url: string): void {
    window.open(url, '_blank')
  }

  public openWindow(url: string): void {
    window.open(url, '_blank')
  }

  public handleKeydown(event: KeyboardEvent, url: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.openLink(url)
    }
  }

  public openFacebookLink(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      window.open('https://www.facebook.com/ultimasolution', '_blank')
    }
  }
}
