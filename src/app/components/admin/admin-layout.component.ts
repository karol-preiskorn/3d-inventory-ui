import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
export class AdminLayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarCollapsed = false;
  mobileMenuOpen = false;

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

  /**
   * Load current user information
   */
  private loadCurrentUser(): void {
    // In a real app, you might get user info from a service
    // For now, we'll create a mock user based on the token
    if (this.authService.isAuthenticated()) {
      // This would typically come from decoding the JWT token or an API call
      this.currentUser = {
        _id: 'current-user',
        name: 'Admin User',
        email: 'admin@3d-inventory.com',
        permissions: ['user_read', 'user_write', 'device_read', 'model_read', 'attribute_read', 'connection_read', 'floor_read']
      };
    }
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
   * Navigate to user profile (placeholder)
   */
  goToProfile(): void {
    // Placeholder for user profile functionality
    // console.log('Navigate to user profile');
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
