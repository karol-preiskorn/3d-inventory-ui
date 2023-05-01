import { Component, Input } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Octokit } from '@octokit/rest'

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
    this.http
      .get('/assets/README.md', { responseType: 'text' })
      .subscribe((data: string) => {
        console.log('Get Markdown ' + JSON.stringify(data))
        this.md = data
      })
  }

  onLoad(data: any) {
    console.log(this.md)
  }

  onError(data: any) {
    console.log(this.md)
  }

  getIssues() {
    octokit
      .paginate(octokit.rest.issues.listForRepo, {
        owner: 'octokit',
        repo: 'rest.js',
      })
      .then((issues) => {
        // issues is an array of all issue objects
      })
  }
}
