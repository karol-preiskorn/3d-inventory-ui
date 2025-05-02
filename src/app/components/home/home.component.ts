import { MarkdownModule } from 'ngx-markdown'

import { CommonModule } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component, NgModule, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MarkdownModule], // Add the module here
})
export class HomeComponent implements OnInit {
  md: string | undefined
  githubIssuesUrl = 'https://api.github.com/karol-preiskorn/3d-inventory-angular-ui/issues'
  githubIssuesUrl2 = 'https://api.github.com/repositories/600698591/issues'
  authToken = ''
  baseUrl = 'https://api.github.com'
  issues = ''
  issuesJson: string = ''
  isDebugMode: boolean = false

  constructor(private readonly http: HttpClient) {}
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

  ngOnInit(): void {
    this.http.get('/assets/README.md', { responseType: 'text' }).subscribe((data: string) => {
      console.log('Get Markdown ' + JSON.stringify(data, null, ' '))
      this.md = data.replaceAll('src/', '')
    })

    this.http.get(this.githubIssuesUrl, this.httpOptions).subscribe((data) => {
      console.log('Get Issues ' + JSON.stringify(data, null, ' '))
      this.issues = data as string
    })
  }

  onLoad(data: unknown) {
    console.log(this.md + ' ' + data)
  }

  onError(data: unknown) {
    console.log(this.md + ' ' + data)
  }

  // async getIssues() {
  //   const octokit = new Octokit({ auth: `personal-access-token123` })
  //   const { data: root } = await octokit.request('GET /')
  //   console.log(root)
  //   octokit.rest.users.getAuthenticated()
  //   octokit
  //     .paginate(
  //       'GET /repos/{owner}/{repo}/issues',
  //       { owner: 'octokit', repo: 'rest.js' },
  //       (response: { data: any[] }) => response.data.map((issue: { title: any }) => issue.title),
  //     )
  //     .then((issueTitles: string[]) => {
  //       // issueTitles is now an array with the titles only
  //     })
  // }
}
