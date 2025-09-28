import { CommonModule } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Converter } from 'showdown'
import { environment } from '../../../environments/environment'
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs'

/**
 * Represents a GitHub issue as returned by the GitHub Issues API.
 * Only a subset of fields is included here for demonstration.
 */
interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: GitHubUser;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
  standalone: true,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  md: string = ''

  // Loading states
  isMarkdownLoading: boolean = false
  isIssuesLoading: boolean = false

  // Error states
  markdownError: string | null = null
  issuesError: string | null = null

  baseUrl = 'https://api.github.com'
  issues: GitHubIssue[] = []
  issuesJson: string = ''
  isDebugMode: boolean = false

  private readonly destroy$ = new Subject<void>()

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode
    this.cdr.markForCheck()
  }

  private loadMarkdown(): void {
    this.isMarkdownLoading = true
    this.markdownError = null
    this.cdr.markForCheck()

    this.http.get('/assets/README.md', { responseType: 'text' })
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.markdownError = 'Failed to load README content. Please try again later.'
          console.error('Error fetching Markdown:', error)
          return of('')
        }),
        finalize(() => {
          this.isMarkdownLoading = false
          this.cdr.markForCheck()
        })
      )
      .subscribe((data: string) => {
        if (data) {
          try {
            data = data.replace(/src\//g, '')
            const converter = new Converter()
            converter.setFlavor('github')
            converter.setOption('tasklists', true)
            converter.setOption('tables', 'true')
            converter.setOption('strikethrough', 'true')
            converter.setOption('ghCompatibleHeaderId', 'true')
            converter.setOption('emoji', 'true')
            converter.setOption('headerLevelStart', 2)
            converter.setOption('literalMidWordUnderscores', 'true')
            converter.setOption('literalMidWordAsterisks', 'true')
            converter.setOption('disableForced4SpacesIndentedSublists', 'true')
            converter.setOption('ghMentions', 'true')
            converter.setOption('ghCodeBlocks', 'true')
            converter.setOption('ghMentionsStyle', 'github')
            converter.setOption('ghMentionsLink', '<a href="https://github.com/{{username}}">{{username}}</a>')

            const html = converter.makeHtml(data)
            this.md = html
            this.cdr.markForCheck()
          } catch (conversionError) {
            this.markdownError = 'Failed to process README content.'
            console.error('Error converting Markdown:', conversionError)
            this.cdr.markForCheck()
          }
        }
      })
  }

  private loadIssues(): void {
    this.isIssuesLoading = true
    this.issuesError = null
    this.cdr.markForCheck()

    this.http.get<GitHubIssue[]>(environment.baseurl + '/github/issues', this.httpOptions)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.issuesError = 'Failed to load GitHub issues. Please check your connection and try again.'
          console.error('Error fetching issues:', error)
          return of([])
        }),
        finalize(() => {
          this.isIssuesLoading = false
          this.cdr.markForCheck()
        })
      )
      .subscribe((data: GitHubIssue[]) => {
        this.issues = data
        this.issuesJson = JSON.stringify(data, null, 2)
        this.cdr.markForCheck()
      })
  }

  retryLoadMarkdown(): void {
    this.loadMarkdown()
  }

  retryLoadIssues(): void {
    this.loadIssues()
  }

  // Template helper methods
  trackIssueById(index: number, issue: GitHubIssue): number {
    return issue.id
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement
    target.src = '/assets/default-avatar.png'
  }

  getStatusBadgeClass(state: string): string {
    switch (state.toLowerCase()) {
      case 'open':
        return 'badge-success'
      case 'closed':
        return 'badge-secondary'
      default:
        return 'badge-primary'
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  constructor(
    @Inject(HttpClient) private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef
  ) {
    console.log('HomeComponent constructor initialized')
  }

  ngOnInit(): void {
    console.log('HomeComponent ngOnInit started')
    this.loadMarkdown()
    this.loadIssues()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
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
