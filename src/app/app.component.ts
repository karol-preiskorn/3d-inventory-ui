import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'

import { AuthenticationService } from './services/authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AppComponent {
  public myTheme: string = 'light'

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.myTheme = localStorage.getItem('theme') ?? 'light'
    this.changeTheme(this.myTheme)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated()
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login'])
  }

  /**
   * Logout user and redirect to home
   */
  logout(): void {
    this.authService.logout()
    this.router.navigate(['/'])
  }

  /**
   * Navigate to admin users page
   */
  goToAdminUsers(): void {
    this.router.navigate(['/admin/users'])
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
