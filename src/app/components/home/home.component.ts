import { MarkdownModule, MarkdownService } from 'ngx-markdown'
import { CommonModule } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component, NgModule, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MarkdownModule],
  providers: [MarkdownService],
  standalone: true,
})
export class HomeComponent implements OnInit {
  md: string | undefined
  githubIssuesUrl = 'https://api.github.com/karol-preiskorn/3d-inventory-angular-ui/issues'
  githubIssuesUrl2 = 'https://api.github.com/repositories/600698591/issues'
  authToken = 'your-valid-token-here' // Replace with a valid token or dynamically fetch it
  baseUrl = 'https://api.github.com'
  issues = ''
  issuesJson: string = ''
  isDebugMode: boolean = false

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode
  }

  constructor(
    private readonly http: HttpClient,
    private readonly markdownService: MarkdownService,
  ) {
    console.log('Markdown constructor: ' + JSON.stringify(this.md, null, ' '))
    this.http.get('/assets/README.md', { responseType: 'text' }).subscribe({
      next: (data: string) => {
        data = data.replace(/src\//g, '')
        this.md = data
      },
      error: (err) => {
        console.error('Error fetching Markdown:', err)
      },
      complete: () => {
        console.log('Markdown fetch completed.')
      },
    })

    if (!this.authToken) {
      console.error('Authorization token is missing. Please set a valid token.')
      return
    }

    this.http.get(this.githubIssuesUrl, this.httpOptions).subscribe((data) => {
      console.log('Get Issues ' + JSON.stringify(data, null, ' '))
      this.issues = data as string
    })
  }

  httpOptions: {
    headers: HttpHeaders
  } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authToken,
    }),
  }

  ngOnInit(): void {
    console.log('Markdown ngOnInit: ' + JSON.stringify(this.md, null, ' '))
    // No need to set renderer here; bind [data]="md" in your template
    // Removed invalid renderer event binding as 'on' does not exist on '_Renderer'
  }

  onLoad(data: unknown) {
    console.log('onLoad: ' + this.md)
  }

  onError(data: unknown) {
    console.log('onError: ' + this.md)
  }

  onSuccess(data: unknown) {
    console.log('onSuccess: ' + this.md)
  }
}
