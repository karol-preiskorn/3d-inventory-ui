import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { environment } from '../../../environments/environment';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpTestingController: HttpTestingController;
  let compiled: HTMLElement;

  const mockGitHubIssues = [
    {
      id: 1,
      number: 123,
      title: 'Test Issue 1',
      body: 'Test issue body',
      state: 'open',
      html_url: 'https://github.com/test/repo/issues/123',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      user: {
        login: 'testuser',
        avatar_url: 'https://github.com/testuser.avatar',
        html_url: 'https://github.com/testuser'
      }
    },
    {
      id: 2,
      number: 124,
      title: 'Test Issue 2',
      body: 'Another test issue',
      state: 'closed',
      html_url: 'https://github.com/test/repo/issues/124',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
      user: {
        login: 'anotheruser',
        avatar_url: 'https://github.com/anotheruser.avatar',
        html_url: 'https://github.com/anotheruser'
      }
    }
  ];

  const mockMarkdownContent = '# Test README\n\nThis is a test readme file.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.md).toBe('');
      expect(component.issues).toEqual([]);
      expect(component.isDebugMode).toBe(false);
      expect(component.isMarkdownLoading).toBe(false);
      expect(component.isIssuesLoading).toBe(false);
      expect(component.markdownError).toBeNull();
      expect(component.issuesError).toBeNull();
    });
  });

  describe('Loading States', () => {
    it('should show markdown loading state initially', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const loadingElement = compiled.querySelector('.spinner-border');
      const loadingText = compiled.querySelector('.text-muted');

      expect(component.isMarkdownLoading).toBe(true);
      expect(loadingElement).toBeTruthy();
      expect(loadingText?.textContent).toContain('Loading README content...');
    });

    it('should show issues loading state initially', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isIssuesLoading).toBe(true);

      const issuesSection = compiled.querySelectorAll('.spinner-border')[1];
      expect(issuesSection).toBeTruthy();
    });
  });

  describe('Successful Data Loading', () => {
    it('should load markdown successfully', () => {
      component.ngOnInit();

      const markdownReq = httpTestingController.expectOne('/assets/README.md');
      expect(markdownReq.request.method).toBe('GET');
      expect(markdownReq.request.responseType).toBe('text');

      markdownReq.flush(mockMarkdownContent);
      fixture.detectChanges();

      expect(component.isMarkdownLoading).toBe(false);
      expect(component.markdownError).toBeNull();
      expect(component.md).toContain('Test README');
    });

    it('should load GitHub issues successfully', () => {
      component.ngOnInit();

      const issuesReq = httpTestingController.expectOne(environment.baseurl + '/github/issues');
      expect(issuesReq.request.method).toBe('GET');

      issuesReq.flush(mockGitHubIssues);

      // Also flush the markdown request to avoid verification error
      const markdownReq = httpTestingController.expectOne('/assets/README.md');
      markdownReq.flush(mockMarkdownContent);

      fixture.detectChanges();

      expect(component.isIssuesLoading).toBe(false);
      expect(component.issuesError).toBeNull();
      expect(component.issues).toEqual(mockGitHubIssues);
      expect(component.issuesJson).toBe(JSON.stringify(mockGitHubIssues, null, 2));
    });
  });

  describe('Error Handling', () => {
    it('should handle markdown loading error', () => {
      component.ngOnInit();

      const markdownReq = httpTestingController.expectOne('/assets/README.md');
      markdownReq.error(new ErrorEvent('Network error'));

      // Flush the GitHub issues request to avoid verification error
      const issuesReq = httpTestingController.expectOne(environment.baseurl + '/github/issues');
      issuesReq.flush([]);

      fixture.detectChanges();

      expect(component.isMarkdownLoading).toBe(false);
      expect(component.markdownError).toBe('Failed to load README content. Please try again later.');
      expect(component.md).toBe('');
    });

    it('should handle GitHub issues loading error', () => {
      component.ngOnInit();

      const issuesReq = httpTestingController.expectOne(environment.baseurl + '/github/issues');
      issuesReq.error(new ErrorEvent('Network error'));

      // Flush the markdown request to avoid verification error
      const markdownReq = httpTestingController.expectOne('/assets/README.md');
      markdownReq.flush('');

      fixture.detectChanges();

      expect(component.isIssuesLoading).toBe(false);
      expect(component.issuesError).toBe('Failed to load GitHub issues. Please check your connection and try again.');
      expect(component.issues).toEqual([]);
    });

    it('should show error message in template for markdown error', () => {
      component.markdownError = 'Test error message';
      component.isMarkdownLoading = false;
      fixture.detectChanges();

      const errorAlert = compiled.querySelector('.alert-danger');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Test error message');
    });

    it('should show error message in template for issues error', () => {
      component.issuesError = 'Issues error message';
      component.isIssuesLoading = false;
      fixture.detectChanges();

      const errorAlert = compiled.querySelector('.alert-warning');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Issues error message');
    });
  });

  describe('Retry Functionality', () => {
    it('should retry loading markdown on button click', () => {
      component.markdownError = 'Test error';
      component.isMarkdownLoading = false;
      fixture.detectChanges();

      const retryButton = compiled.querySelector('.btn-outline-danger') as HTMLButtonElement;
      expect(retryButton).toBeTruthy();

      retryButton.click();

      expect(component.isMarkdownLoading).toBe(true);
      expect(component.markdownError).toBeNull();

      // Clean up the request
      const markdownReq = httpTestingController.expectOne('/assets/README.md');
      markdownReq.flush('');
    });

    it('should retry loading issues on button click', () => {
      component.issuesError = 'Test error';
      component.isIssuesLoading = false;
      fixture.detectChanges();

      const retryButton = compiled.querySelector('.btn-outline-warning') as HTMLButtonElement;
      expect(retryButton).toBeTruthy();

      retryButton.click();

      expect(component.isIssuesLoading).toBe(true);
      expect(component.issuesError).toBeNull();

      // Clean up the request
      const issuesReq = httpTestingController.expectOne(environment.baseurl + '/github/issues');
      issuesReq.flush([]);
    });
  });

  describe('Template Helper Methods', () => {
    it('should track issues by ID', () => {
      const issue = mockGitHubIssues[0];
      const result = component.trackIssueById(0, issue);
      expect(result).toBe(issue.id);
    });

    it('should handle image error', () => {
      const mockEvent = {
        target: { src: 'https://invalid-url.com' }
      } as any;

      component.onImageError(mockEvent);

      expect(mockEvent.target.src).toBe('/assets/default-avatar.png');
    });

    it('should return correct badge class for issue states', () => {
      expect(component.getStatusBadgeClass('open')).toBe('badge-success');
      expect(component.getStatusBadgeClass('closed')).toBe('badge-secondary');
      expect(component.getStatusBadgeClass('unknown')).toBe('badge-primary');
    });

    it('should format dates correctly', () => {
      const dateString = '2025-01-15T10:30:00Z';
      const result = component.formatDate(dateString);

      expect(result).toMatch(/Jan 15, 2025/);
    });

    it('should handle invalid date formatting', () => {
      const result = component.formatDate('invalid-date');
      expect(result).toBe('Invalid date');
    });
  });

  describe('Debug Mode', () => {
    it('should toggle debug mode', () => {
      expect(component.isDebugMode).toBe(false);

      component.toggleDebugMode();
      expect(component.isDebugMode).toBe(true);

      component.toggleDebugMode();
      expect(component.isDebugMode).toBe(false);
    });

    it('should show debug information when debug mode is on', () => {
      component.isDebugMode = true;
      component.issuesJson = '{"test": "data"}';
      fixture.detectChanges();

      const debugSection = compiled.querySelector('.card-body');
      expect(debugSection).toBeTruthy();
      expect(debugSection?.textContent).toContain('Raw Issues JSON:');
    });

    it('should hide debug information when debug mode is off', () => {
      component.isDebugMode = false;
      fixture.detectChanges();

      const debugSection = compiled.querySelector('.card-body');
      expect(debugSection).toBeFalsy();
    });
  });

  describe('Issues Display', () => {
    it('should display issues list when data is loaded', () => {
      component.issues = mockGitHubIssues;
      component.isIssuesLoading = false;
      component.issuesError = null;
      fixture.detectChanges();

      const issueItems = compiled.querySelectorAll('.issue-item');
      expect(issueItems.length).toBe(2);

      const firstIssueTitle = issueItems[0].querySelector('h6');
      expect(firstIssueTitle?.textContent).toContain('Test Issue 1');
    });

    it('should show empty state when no issues', () => {
      component.issues = [];
      component.isIssuesLoading = false;
      component.issuesError = null;
      fixture.detectChanges();

      const emptyState = compiled.querySelector('.text-center .text-muted');
      expect(emptyState?.textContent).toContain('No issues found.');
    });
  });

  describe('Component Lifecycle', () => {
    it('should call loadMarkdown and loadIssues on ngOnInit', () => {
      spyOn(component, 'loadMarkdown' as any);
      spyOn(component, 'loadIssues' as any);

      component.ngOnInit();

      expect((component as any).loadMarkdown).toHaveBeenCalled();
      expect((component as any).loadIssues).toHaveBeenCalled();
    });

    it('should complete destroy subject on ngOnDestroy', () => {
      spyOn((component as any).destroy$, 'next');
      spyOn((component as any).destroy$, 'complete');

      component.ngOnDestroy();

      expect((component as any).destroy$.next).toHaveBeenCalled();
      expect((component as any).destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('Change Detection', () => {
    it('should call markForCheck when toggling debug mode', () => {
      spyOn((component as any).cdr, 'markForCheck');

      component.toggleDebugMode();

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });
  });
});
