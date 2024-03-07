import {Component, OnInit} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  md: string | undefined
  githubIssuesUrl = 'https://api.github.com/karol-preiskorn/3d-inventory-angular-ui/issues'
  githubIssuesUrl2 = 'https://api.github.com/repositories/600698591/issues'
  // TODO: get this form .env
  authToken = ''
  baseUrl = 'https://api.github.com'

  constructor(private http: HttpClient) {}
  httpOptions: {
    headers: HttpHeaders
  } = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + this.authToken,
      'Access-Control-Allow-Origin': 'https://api.github.com/',
    }),
  }

  async ngOnInit(): Promise<void> {
    this.http.get('/assets/README.md', {responseType: 'text'}).subscribe((data: string) => {
      // console.log('Get Markdown ' + JSON.stringify(data, null, ' '))
      this.md = data.replaceAll('src/', '')
    })

    // await this.http
    //   .get(this.githubIssuesUrl, this.httpOptions)
    //   .subscribe((data) => {
    //     console.log('Get Issues ' + JSON.stringify(data, null, ' '))
    //     this.issues = data
    //   })
  }

  // onLoad(data: unknown) {
  //   // console.log(this.md + ' ' + data)
  // }

  // onError(data: unknown) {
  //   // console.log(this.md + ' ' + data)
  // }

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
