import { ErrorHandler, Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {

  handleError(error: Error): void {
    // Log the error to the console.
    console.error(error)

    // Display a friendly error message to the user.
    alert('An unexpected error occurred. Please try again later.')
  }
}
