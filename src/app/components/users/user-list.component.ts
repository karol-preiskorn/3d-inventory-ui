import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

  // Permission viewing
  showPermissionsModal = false;
  selectedUserForPermissions: User | null = null;

  // Role/Permission editing
  showEditRoleModal = false;
  selectedUserForEdit: User | null = null;
  selectedRoleForEdit: string = '';
  selectedPermissionsForEdit: string[] = [];
  savingRoleChanges = false;

  // Expose Math to the template
  Math = Math;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
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
    this.cdr.markForCheck();

    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        // Ensure users is always an array
        this.users = Array.isArray(users) ? users : [];
        this.applyFiltersAndSort();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.users = []; // Reset to empty array on error
        this.filteredUsers = [];
        this.error = error.message || 'Failed to load users';
        this.loading = false;
        this.cdr.markForCheck();
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
    // Ensure this.users is an array
    if (!Array.isArray(this.users)) {
      console.warn('Users is not an array, initializing as empty array:', this.users);
      this.users = [];
    }

    let filtered = [...this.users];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        (user.username?.toLowerCase().includes(query) ||
         user.name?.toLowerCase().includes(query) ||
         user.email?.toLowerCase().includes(query))
      );
    }

    // Apply role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => {
        // Try multiple approaches to match the role
        const userRole = this.userService.getUserRole(user);

        // Match by role ID (from getUserRole)
        if (userRole?.id === this.selectedRole) {
          return true;
        }

        // Match by user.role property (direct role string)
        if (user.role === this.selectedRole) {
          return true;
        }

        // Match by role name (case-insensitive)
        if (user.role?.toLowerCase() === this.selectedRole.toLowerCase()) {
          return true;
        }

        return false;
      });
    }

    // Apply sorting with safe property access
    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (this.sortBy) {
        case 'name':
          aValue = a.username || a.name || a.email || '';
          bValue = b.username || b.name || b.email || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'role':
          aValue = this.userService.getUserRole(a)?.name || '';
          bValue = this.userService.getUserRole(b)?.name || '';
          break;
        default:
          aValue = a.username || a.name || a.email || '';
          bValue = b.username || b.name || b.email || '';
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

    this.cdr.markForCheck();
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
      this.cdr.markForCheck();
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
      message: `Are you sure you want to delete user "${user.username || user.name}"? This action cannot be undone.`,
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
            this.cdr.markForCheck();
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

  /**
   * Show permissions for a user
   */
  viewUserPermissions(user: User): void {
    this.selectedUserForPermissions = user;
    this.showPermissionsModal = true;
    this.cdr.markForCheck();
  }

  /**
   * Close permissions modal
   */
  closePermissionsModal(): void {
    this.showPermissionsModal = false;
    this.selectedUserForPermissions = null;
    this.cdr.markForCheck();
  }

  /**
   * Get permission display name
   */
  getPermissionDisplayName(permission: string): string {
    return permission.replace(/[_:]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get permission category
   */
  getPermissionCategory(permission: string): string {
    const parts = permission.split(':');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }

  /**
   * Group permissions by category
   */
  getGroupedPermissions(permissions: string[]): { [category: string]: string[] } {
    const grouped: { [category: string]: string[] } = {};

    permissions.forEach(permission => {
      const category = this.getPermissionCategory(permission);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });

    return grouped;
  }

  /**
   * Open role/permission edit modal for a user (admin only)
   */
  editUserRole(user: User): void {
    if (!this.canUpdateUser) {
      return;
    }

    this.selectedUserForEdit = user;
    this.selectedPermissionsForEdit = [...(user.permissions || [])];

    // Determine current role
    const currentRole = this.userService.getUserRole(user);
    this.selectedRoleForEdit = currentRole?.id || '';

    this.showEditRoleModal = true;
    this.cdr.markForCheck();
  }

  /**
   * Close role/permission edit modal
   */
  closeEditRoleModal(): void {
    this.showEditRoleModal = false;
    this.selectedUserForEdit = null;
    this.selectedRoleForEdit = '';
    this.selectedPermissionsForEdit = [];
    this.savingRoleChanges = false;
    this.cdr.markForCheck();
  }

  /**
   * Handle role selection change
   */
  onRoleChange(roleId: string): void {
    this.selectedRoleForEdit = roleId;
    if (roleId) {
      // Update permissions based on selected role
      const rolePermissions = this.userService.getPermissionsForRole(roleId);
      this.selectedPermissionsForEdit = rolePermissions.map(p => p.toString());
    }
    this.cdr.markForCheck();
  }

  /**
   * Toggle permission selection
   */
  togglePermission(permission: string): void {
    const index = this.selectedPermissionsForEdit.indexOf(permission);
    if (index > -1) {
      this.selectedPermissionsForEdit.splice(index, 1);
    } else {
      this.selectedPermissionsForEdit.push(permission);
    }
    this.cdr.markForCheck();
  }

  /**
   * Check if permission is selected
   */
  isPermissionSelected(permission: string): boolean {
    return this.selectedPermissionsForEdit.includes(permission);
  }

  /**
   * Get all available permissions
   */
  getAllPermissions(): Permission[] {
    return Object.values(Permission);
  }

  /**
   * Get all permissions as strings
   */
  getAllPermissionsAsStrings(): string[] {
    return this.getAllPermissions().map(p => p.toString());
  }

  /**
   * Save role and permission changes
   */
  saveRoleChanges(): void {
    if (!this.selectedUserForEdit || !this.canUpdateUser) {
      return;
    }

    this.savingRoleChanges = true;
    this.error = null;
    this.cdr.markForCheck();

    const updateData = {
      permissions: this.selectedPermissionsForEdit,
      role: this.selectedRoleForEdit
    };

    this.userService.updateUser(this.selectedUserForEdit._id, updateData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.dialogService.alert({
          title: 'Success',
          message: 'User role and permissions updated successfully'
        }).subscribe(() => {
          this.closeEditRoleModal();
          this.loadUsers(); // Reload to show updated data
        });
      },
      error: (error) => {
        this.error = error.message || 'Failed to update user role and permissions';
        this.savingRoleChanges = false;
        this.cdr.markForCheck();
        console.error('Error updating user role:', error);
      }
    });
  }
}
