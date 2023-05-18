import { Component } from '@angular/core'
import { setTheme } from 'ngx-bootstrap/utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '3d-inventory-angular-ui'

  constructor() {
    setTheme('bs5')
  }
}
