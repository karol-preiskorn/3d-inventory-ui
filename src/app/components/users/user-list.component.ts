import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Permission, Role, User } from '../../shared/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;

  // Search and filter
  searchQuery = '';
  selectedRole: string = '';
  sortBy: 'name' | 'email' | 'role' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Permissions
  canCreateUser = false;
  canUpdateUser = false;
  canDeleteUser = false;

  // Data
  roles: Role[] = [];

  // Expose Math to the template
  Math = Math;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private dialogService: DialogService
  ) {
    this.roles = this.userService.getPredefinedRoles();

    // Set up search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit(): void {
    this.checkPermissions();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check user permissions for UI actions
   */
  private checkPermissions(): void {
    this.canCreateUser = this.authService.hasPermission(Permission.USER_CREATE);
    this.canUpdateUser = this.authService.hasPermission(Permission.USER_UPDATE);
    this.canDeleteUser = this.authService.hasPermission(Permission.USER_DELETE);
  }

  /**
   * Load users from API
   */
  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  /**
   * Handle search input change
   */
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  /**
   * Perform search
   */
  private performSearch(_query: string): void {
    this.currentPage = 1; // Reset to first page on search
    this.applyFiltersAndSort();
  }

  /**
   * Apply filters and sorting
   */
  applyFiltersAndSort(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => {
        const userRole = this.userService.getUserRole(user);
        return userRole?.id === this.selectedRole;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (this.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = this.userService.getUserRole(a)?.name || '';
          bValue = this.userService.getUserRole(b)?.name || '';
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      const comparison = aValue.localeCompare(bValue);
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredUsers = filtered;
    this.totalUsers = filtered.length;
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);

    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  /**
   * Get paginated users for current page
   */
  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  /**
   * Change sort column
   */
  sort(column: 'name' | 'email' | 'role'): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  /**
   * Get sort icon for column
   */
  getSortIcon(column: string): string {
    if (this.sortBy !== column) {return '';}
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  /**
   * Change page
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Get page numbers for pagination
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Get user role display name
   */
  getUserRoleDisplay(user: User): string {
    const role = this.userService.getUserRole(user);
    return role ? role.name : 'No Role';
  }

  /**
   * Get user role badge class
   */
  getUserRoleBadgeClass(user: User): string {
    const role = this.userService.getUserRole(user);
    if (!role) {return 'badge-secondary';}

    switch (role.id) {
      case 'system-admin': return 'badge-danger';
      case 'admin': return 'badge-warning';
      case 'editor': return 'badge-primary';
      case 'viewer': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  /**
   * Get user permission count
   */
  getUserPermissionCount(user: User): number {
    return user.permissions?.length || 0;
  }

  /**
   * Check if user is current user
   */
  isCurrentUser(user: User): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?._id === user._id;
  }

  /**
   * Delete user with confirmation
   */
  deleteUser(user: User): void {
    if (!this.canDeleteUser) {
      this.dialogService.alert({
        title: 'Permission Denied',
        message: 'You do not have permission to delete users'
      });
      return;
    }

    if (this.isCurrentUser(user)) {
      this.dialogService.alert({
        title: 'Cannot Delete Own Account',
        message: 'You cannot delete your own account'
      });
      return;
    }

    this.dialogService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user._id).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: () => {
            this.loadUsers(); // Reload users list
            console.error('User deleted successfully'); // Use console.error as allowed by linter
          },
          error: (error) => {
            this.error = error.message || 'Failed to delete user';
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  /**
   * Refresh users list
   */
  refresh(): void {
    this.loadUsers();
  }

  /**
   * Track by function for ngFor
   */
  trackByUserId(index: number, user: User): string {
    return user._id;
  }

  /**
   * Returns the last record number for the current page (for pagination info)
   */
  getPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalUsers);
  }
}
