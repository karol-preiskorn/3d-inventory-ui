import { CommonModule } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Converter } from 'showdown'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class HomeComponent implements OnInit {
  md: string = ''
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

  constructor(private readonly http: HttpClient) {
    console.log('Markdown constructor: ' + JSON.stringify(this.md, null, ' '))
    this.http.get('/assets/README.md', { responseType: 'text' }).subscribe(
      (data: string) => {
        data = data.replace(/src\//g, '')
        const converter = new Converter()
        converter.setFlavor('github')
        converter.setOption('tasklists', true)
        converter.setOption('tables', 'true')
        converter.setOption('strikethrough', 'true')
        converter.setOption('ghCompatibleHeaderId', 'true')
        converter.setOption('emoji', 'true')
        converter.setOption('simplifiedAutoLink', 'true')
        converter.setOption('openLinksInNewWindow', 'true')
        converter.setOption('headerLevelStart', 2) // Start headers from level 2
        converter.setOption('literalMidWordUnderscores', 'true')
        converter.setOption('literalMidWordAsterisks', 'true')
        converter.setOption('disableForced4SpacesIndentedSublists', 'true')
        converter.setOption('ghMentions', 'true')
        converter.setOption('ghCodeBlocks', 'true')
        converter.setOption('ghMentionsStyle', 'github')
        converter.setOption('ghMentionsLink', '<a href="https://github.com/{{username}}">{{username}}</a>')
        const html = converter.makeHtml(data)
        this.md = html
      },
      (err) => {
        console.error('Error fetching Markdown:', err)
      },
      () => {
        console.log('Markdown fetch completed.')
      },
    )

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
