import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { Permission, User } from '../../shared/user';

/**
 * Admin Layout Component
 *
 * Provides the layout wrapper for all admin pages with:
 * - Top navigation bar with user info and logout
 * - Sidebar navigation for admin sections
 * - Main content area with router outlet
 * - Responsive design with mobile-friendly collapsible sidebar
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  sidebarCollapsed = false;
  mobileMenuOpen = false;

  private destroy$ = new Subject<void>();

  navigationItems = [
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'User Management',
      permission: 'user_read'
    },
    {
      path: '/device-list',
      icon: 'fas fa-server',
      label: 'Devices',
      permission: 'device_read'
    },
    {
      path: '/models-list',
      icon: 'fas fa-cube',
      label: 'Models',
      permission: 'model_read'
    },
    {
      path: '/attribute-dictionary-list',
      icon: 'fas fa-book',
      label: 'Attributes',
      permission: 'attribute_read'
    },
    {
      path: '/connection-list',
      icon: 'fas fa-network-wired',
      label: 'Connections',
      permission: 'connection_read'
    },
    {
      path: '/floor-list',
      icon: 'fas fa-building',
      label: 'Floors',
      permission: 'floor_read'
    }
  ];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current user information
   */
  private loadCurrentUser(): void {
    // Get user info from authentication service
    this.authService.authState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(authState => {
      if (authState.isAuthenticated && authState.user) {
        this.currentUser = authState.user;
      } else {
        this.currentUser = null;
      }
    });
  }

  /**
   * Check if user has permission to see a navigation item
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser) {return false;}
    return this.userService.userHasPermission(this.currentUser, permission as Permission);
  }

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Close mobile menu when clicking outside or on link
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  /**
   * Logout user and redirect to login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to user profile
   */
  goToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  /**
   * Navigate to home page
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Check if a route is currently active
   */
  isRouteActive(path: string): boolean {
    return this.router.url === path;
  }
}
