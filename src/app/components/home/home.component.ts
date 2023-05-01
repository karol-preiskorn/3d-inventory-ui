import { Component, Input } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  md: string | undefined
  @Input() name: string
  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.md = await this.http
      .get('/assets/README.md', { responseType: 'text' })
      .toPromise()
  }

  onLoad(data: any) {
    console.log(this.md)
  }

  onError(data: any) {
    console.log(this.md)
  }
}
