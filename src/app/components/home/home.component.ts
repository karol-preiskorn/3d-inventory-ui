import { CommonModule } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component, Inject, OnInit } from '@angular/core'
import { Converter } from 'showdown'
import { environment } from '../../../environments/environment'

/**
 * Represents a GitHub issue as returned by the GitHub Issues API.
 * Only a subset of fields is included here for demonstration.
 */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
  standalone: true,
  providers: []
})
export class HomeComponent implements OnInit {
  md: string = ''

  baseUrl = 'https://api.github.com'
  issues: any[] = []
  issuesJson: string = ''
  isDebugMode: boolean = false

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode
  }

  constructor(@Inject(HttpClient) private readonly http: HttpClient) {
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
      (err: any) => {
        console.error('Error fetching Markdown:', err)
      },
      () => {
        console.log('Markdown fetch completed.')
      },
    )

    this.http.get<[]>(environment.baseurl + '/github/issues', this.httpOptions).subscribe({
      next: (data: any[]) => {
        this.issues = data
        this.issuesJson = JSON.stringify(data, null, 2)
      },
      error: (error: any) => {
        console.error('Error fetching issues:', error)
      }
    })
  }

  ngOnInit(): void {
    console.log('Markdown ngOnInit: ' + JSON.stringify(this.md))
    // No need to set renderer here; bind [data]="md" in your template
    // Removed invalid renderer event binding as 'on' does not exist on '_Renderer'
  }

  onLoad(_data: unknown) {
    console.log('onLoad: ' + this.md)
  }

  onError(_data: unknown) {
    console.log('onError: ' + this.md)
  }

  onSuccess(_data: unknown) {
    console.log('onSuccess: ' + this.md)
  }
}
