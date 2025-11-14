---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: '**/*.ts,**/*.js,**/*.json'
description: Security Scanning Requirements and Standards for Angular UI
---

# Security Rules & Snyk Integration - Angular UI

This document defines security scanning requirements and Snyk integration standards for the 3D Inventory Angular UI project.

## 🔒 Security Scanning Requirements

### 1. Automated Security Scans

All code must pass the following security scans:

- **npm audit**: No high or critical vulnerabilities
- **Snyk**: Vulnerability scanning for dependencies
- **Container scanning**: Trivy for Docker images
- **Static analysis**: CodeQL for code vulnerabilities

### 2. Snyk Configuration

#### Installation and Authentication

```bash
# Install Snyk globally
npm install -g snyk

# Authenticate with Snyk
npm run snyk:auth
# or
snyk auth
```

#### Required Snyk Scripts (package.json)

```json
{
  "scripts": {
    "snyk:test": "snyk test",
    "snyk:test:exclude-docs": "snyk test --exclude=docs",
    "snyk:monitor": "snyk monitor",
    "snyk:auth": "snyk auth",
    "snyk:code": "snyk code test",
    "snyk:iac": "snyk iac test"
  }
}
```

### 3. Angular-Specific Security Rules

#### XSS Prevention

```typescript
// ❌ INCORRECT - Direct innerHTML usage
export class UnsafeComponent {
  userContent: string = '<script>alert("XSS")</script>'

  ngOnInit() {
    document.getElementById('content')!.innerHTML = this.userContent
  }
}

// ✅ CORRECT - Use DomSanitizer
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

export class SafeComponent {
  constructor(private sanitizer: DomSanitizer) {}

  get sanitizedContent(): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.userContent) || ''
  }
}
```

#### Template Security

```html
<!-- ❌ INCORRECT - Unsafe binding -->
<div [innerHTML]="userContent"></div>

<!-- ✅ CORRECT - Sanitized binding -->
<div [innerHTML]="sanitizedContent"></div>

<!-- ✅ BEST - Use Angular interpolation -->
<div>{{ userContent }}</div>
```

#### Security Context

```typescript
// ✅ CORRECT - Proper security context usage
import { SecurityContext } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

export class SecurityService {
  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || ''
  }

  sanitizeUrl(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.URL, value) || ''
  }

  sanitizeStyle(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.STYLE, value) || ''
  }
}
```

### 4. Dependency Security

#### Allowed Dependency Sources

- **npm registry**: Official packages only
- **@angular/\***: Official Angular packages
- **@types/\***: Official TypeScript definitions

#### Prohibited Practices

```typescript
// ❌ INCORRECT - Hardcoded secrets
const API_KEY = 'sk_live_1234567890abcdef'

// ✅ CORRECT - Use environment variables
import { environment } from '@env/environment'
const API_KEY = environment.apiKey

// ❌ INCORRECT - Unsafe eval
const code = 'alert("XSS")'
eval(code)

// ✅ CORRECT - Never use eval
// If dynamic code is needed, use safer alternatives

// ❌ INCORRECT - Insecure random
Math.random() // Not cryptographically secure

// ✅ CORRECT - Use crypto for security
window.crypto.getRandomValues(new Uint32Array(1))[0]
```

### 5. HTTP Security

#### Secure HTTP Client Usage

```typescript
// ✅ CORRECT - Secure HTTP with authentication
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@env/environment'

@Injectable({ providedIn: 'root' })
export class SecureApiService {
  private readonly apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getData(): Observable<Data[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    })

    return this.http.get<Data[]>(`${this.apiUrl}/data`, { headers }).pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Don't expose internal error details to users
    console.error('API Error:', error)
    return throwError(() => new Error('An error occurred'))
  }
}
```

#### CORS Configuration

```typescript
// Backend CORS configuration (for reference)
// Must be implemented on API side, not client
export const corsOptions = {
  origin: environment.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
```

### 6. Authentication Security

#### JWT Token Handling

```typescript
// ✅ CORRECT - Secure token storage
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token'

  setToken(token: string): void {
    // Store in memory or sessionStorage for better security
    sessionStorage.setItem(this.TOKEN_KEY, token)
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY)
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY)
  }

  // Validate token expiration
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}
```

### 7. Security Testing Requirements

#### Unit Tests for Security

```typescript
// Required security tests
describe('SecurityService', () => {
  it('should sanitize malicious HTML', () => {
    const maliciousHtml = '<script>alert("XSS")</script><p>Safe</p>'
    const sanitized = securityService.sanitizeHtml(maliciousHtml)
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).toContain('<p>Safe</p>')
  })

  it('should sanitize malicious URLs', () => {
    const maliciousUrl = 'javascript:alert("XSS")'
    const sanitized = securityService.sanitizeUrl(maliciousUrl)
    expect(sanitized).toBe('unsafe:javascript:alert("XSS")')
  })

  it('should validate token expiration', () => {
    const expiredToken = createExpiredToken()
    expect(authService.isTokenExpired(expiredToken)).toBe(true)
  })
})
```

### 8. CI/CD Security Gates

#### Pre-commit Security Checks

```bash
#!/bin/bash
# .husky/pre-commit security checks

echo "🔒 Running security checks..."

# Check for hardcoded secrets
if grep -r "password.*=.*['\"]" src/ --include="*.ts" | grep -v "formControl"; then
  echo "❌ Potential hardcoded password detected!"
  exit 1
fi

# Check for API keys
if grep -r "api.*key.*=.*['\"]" src/ --include="*.ts" | grep -v "environment"; then
  echo "❌ Potential hardcoded API key detected!"
  exit 1
fi

# Run Snyk test
npm run snyk:test || {
  echo "⚠️ Snyk vulnerabilities detected"
  # Don't fail build, just warn
}

echo "✅ Security checks passed"
```

#### GitHub Actions Security Workflow

Required workflows:

- `security.yml` - Weekly security scanning
- `dependency-updates.yml` - Automated dependency updates
- Check for high/critical vulnerabilities before deployment

### 9. Security Checklist

Before deploying to production:

- [ ] All npm dependencies scanned with Snyk
- [ ] No high or critical vulnerabilities
- [ ] HTTPS enforced for all API calls
- [ ] Authentication tokens properly managed
- [ ] User input sanitized in templates
- [ ] No hardcoded secrets in code
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] CORS properly configured on backend
- [ ] Error messages don't expose sensitive information
- [ ] Docker image scanned with Trivy

### 10. Vulnerability Response

#### Severity Levels

- **Critical**: Fix immediately (within 24 hours)
- **High**: Fix within 1 week
- **Medium**: Fix within 1 month
- **Low**: Fix in next release cycle

#### Response Process

1. Identify vulnerable dependency
2. Check for available patch/update
3. Test update in development
4. Create PR with security fix
5. Deploy to production
6. Document in security log

### 11. Security Resources

- **Angular Security Guide**: https://angular.io/guide/security
- **Snyk Documentation**: https://docs.snyk.io/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **npm Security Best Practices**: https://docs.npmjs.com/security-best-practices

---

**Compliance**: All code must meet these security standards before merging to main branch.
**Enforcement**: Automated security scans run on every PR and weekly schedule.
**Monitoring**: Security vulnerabilities tracked and reported in GitHub Security tab.
