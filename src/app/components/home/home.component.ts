import { CommonModule } from '@angular/common'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'
import { Converter } from 'showdown'
import { environment } from '../../../environments/environment'
import { AuthenticationService } from '../../services/authentication.service'

/**
 * Represents a GitHub issue as returned by the GitHub Issues API.
 * Only a subset of fields is included here for demonstration.
 */
interface GitHubIssue {
  id: number;
  title: string;
  state: string;
  number: number;
  body?: string;
  html_url?: string;
  user?: {
    login: string;
    avatar_url?: string;
    html_url?: string;
  };
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
export class HomeComponent implements OnInit {
  md: string = ''

  baseUrl = 'https://api.github.com'
  issues: GitHubIssue[] = []
  issuesJson: string = ''
  isDebugMode: boolean = false
  showGitHubIssues: boolean = false  // Control visibility of GitHub issues feature

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode
  }

  constructor(
    @Inject(HttpClient) private readonly http: HttpClient,
    private readonly authService: AuthenticationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load README markdown
    this.loadReadme()

    // Check if user has admin:access permission before attempting to load GitHub issues
    const hasAdminAccess = this.authService.hasPermission('admin:access')
    const currentUser = this.authService.getCurrentUser()

    if (hasAdminAccess) {
      console.warn('✅ Admin access detected - loading GitHub issues')
      this.showGitHubIssues = true
      this.loadGitHubIssues()
    } else {
      console.warn('ℹ️ Insufficient permissions - skipping GitHub issues (requires admin:access)')
      this.showGitHubIssues = false
      this.issuesJson = JSON.stringify({
        info: 'GitHub Issues',
        status: 'Not Available',
        message: 'This feature is only available to users with admin:access permission',
        currentUser: currentUser?.name || 'not authenticated',
        userPermissions: currentUser?.permissions || [],
        requiredPermission: 'admin:access',
        suggestion: 'Please login with an admin account to view GitHub issues'
      }, null, 2)
      this.cdr.markForCheck()
    }
  }

  /**
   * Load README.md file and convert to HTML
   */
  private loadReadme(): void {
    this.http.get('/assets/README.md', { responseType: 'text' }).subscribe({
      next: (data: string) => {
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

        // Trigger change detection for OnPush strategy
        this.cdr.markForCheck()
        console.warn('✅ README.md loaded and converted to HTML')
      },
      error: (err: unknown) => {
        console.error('❌ Error fetching README.md:', err)
        this.md = '<p class="text-red-600">Error loading README.md. Please check console for details.</p>'
        this.cdr.markForCheck()
      }
    })
  }

  /**
   * Load GitHub issues from API
   * Only called if user has admin:access permission
   */
  private loadGitHubIssues(): void {
    const isAuthenticated = this.authService.isAuthenticated()
    const token = this.authService.getCurrentToken()

    console.warn('🔒 Authentication Debug:', {
      isAuthenticated,
      hasToken: !!token,
      tokenLength: token?.length
    })

    this.http.get<GitHubIssue[]>(environment.baseurl + '/github/issues', {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data: GitHubIssue[]) => {
        this.issues = data
        this.issuesJson = JSON.stringify(data, null, 2)
        this.cdr.markForCheck()
        console.warn('✅ GitHub issues loaded successfully:', data.length)
      },
      error: (error: unknown) => {
        console.error('❌ Error fetching GitHub issues:', error)

        // Handle 403 Forbidden error
        if (error && typeof error === 'object' && 'status' in error) {
          const httpError = error as HttpErrorResponse

          if (httpError.status === 403) {
            console.warn('⚠️ Access Denied: GitHub issues require admin:access permission')
            this.issuesJson = JSON.stringify({
              error: 'Access Denied',
              message: 'GitHub issues are only available to users with admin:access permission',
              currentUser: this.authService.getCurrentUser()?.name || 'unknown',
              requiredPermission: 'admin:access',
              suggestion: 'Please login with an admin account to view this feature',
              errorDetails: httpError.error
            }, null, 2)
            this.cdr.markForCheck()
            return
          }

          if (httpError.status === 401) {
            console.warn('⚠️ Not authenticated. Please login first.')
            this.issuesJson = JSON.stringify({
              error: 'Not Authenticated',
              message: 'Please login to view GitHub issues'
            }, null, 2)
            this.cdr.markForCheck()
            return
          }
        }

        // Generic error handling
        if (!isAuthenticated) {
          console.warn('⚠️ User is not authenticated. Please login first.')
        }

        this.issuesJson = JSON.stringify({
          error: 'Failed to load GitHub issues',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, null, 2)
        this.cdr.markForCheck()
      }
    })
  }

  onLoad(_data: unknown) {
    // Markdown loaded successfully
  }

  onError(_data: unknown) {
    // Markdown loading error occurred
  }

  onSuccess(_data: unknown) {
    // Markdown rendered successfully
  }
}
