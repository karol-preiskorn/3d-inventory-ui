import { Component } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MarkdownService } from 'ngx-markdown'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  md: string | undefined
  issues: any
  githubIssuesUrl =
    'https://api.github.com/karol-preiskorn/3d-inventory-angular-ui/issues'
  githubIssuesUrl2 = 'https://api.github.com/repositories/600698591/issues'
  // TODO: get this form .env
  authToken =
    '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'
  baseUrl = 'https://api.github.com'

  constructor(private http: HttpClient) {}
  httpOptions: {
    headers: HttpHeaders
  } = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + this.authToken,
      'Access-Control-Allow-Origin': 'https://api.github.com/',
    }),
  }
  async ngOnInit() {
    this.http
      .get('/assets/README.md', { responseType: 'text' })
      .subscribe((data: string) => {
        // console.log('Get Markdown ' + JSON.stringify(data))
        this.md = data
      })

    // await this.http
    //   .get(this.githubIssuesUrl, this.httpOptions)
    //   .subscribe((data) => {
    //     console.log('Get Issues ' + JSON.stringify(data))
    //     this.issues = data
    //   })
  }

  onLoad(data: unknown) {
    // console.log(this.md + ' ' + data)
  }

  onError(data: unknown) {
    // console.log(this.md + ' ' + data)
  }

  async getIssues() {
    // const { data: root } = await this.octokit.request('GET /')
    // console.log(root)
    //this.octokit.rest.users.getAuthenticated()
    //   this.octokit
    //     .paginate(
    //       'GET /repos/{owner}/{repo}/issues',
    //       { owner: 'octokit', repo: 'rest.js' },
    //       (response) => response.data.map((issue) => issue.title)
    //     )
    //     .then((issueTitles: string[]) => {
    //       // issueTitles is now an array with the titles only
    //     })
  }
}
