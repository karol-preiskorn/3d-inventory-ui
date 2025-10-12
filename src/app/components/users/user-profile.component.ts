import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PREDEFINED_ROLES, User } from '../../shared/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogService } from '../../services/dialog.service';
import { environment } from '../../../environments/environment';
import { LoginLogsComponent } from '../login-logs/login-logs.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoginLogsComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  loading = false;
  saving = false;
  error: string | null = null;
  successMessage: string | null = null;
  showPasswordChange = false;
  showPermissionsModal = false; // For permissions modal

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private dialogService: DialogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    console.warn('🚀 [Profile Debug] Component initialized');
    console.warn('🚀 [Profile Debug] Initial form state:', this.profileForm.value);
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create profile form
   */
  private createProfileForm(): FormGroup {
    return this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }], // Display user's application role
      currentPassword: ['', [Validators.required]],
    });
  }

  /**
   * Create password change form
   */
  private createPasswordForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validate that passwords match
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Load current user profile from API
   */
  private loadCurrentUser(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    const user = this.authService.getCurrentUser();
    console.warn('🔍 [Profile Debug] Current user from auth:', user);
    console.warn('🔍 [Profile Debug] User ID:', user?._id);

    if (!user || !user._id) {
      console.error('❌ [Profile Debug] User not found or missing _id');
      this.error = 'User not found';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    console.warn('📡 [Profile Debug] Calling getUserById with ID:', user._id);
    console.warn('📡 [Profile Debug] API URL will be:', `${environment.baseurl}/user-management/${user._id}`);
    this.userService
      .getUserById(user._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData: User) => {
          console.warn('✅ [Profile Debug] RAW API Response:', userData);
          console.warn('✅ [Profile Debug] Response type:', typeof userData);
          console.warn('✅ [Profile Debug] Response keys:', Object.keys(userData || {}));
          console.warn('✅ [Profile Debug] User structure:', {
            _id: userData._id,
            username: userData.username,
            name: userData.name,
            email: userData.email,
            hasUsername: !!userData.username,
            hasName: !!userData.name,
            hasEmail: !!userData.email,
            fullObject: JSON.stringify(userData)
          });
          this.currentUser = userData;
          console.warn('✅ [Profile Debug] currentUser set:', this.currentUser);
          this.populateForm(userData);
          this.loading = false;
          this.cdr.markForCheck();
          console.warn('📝 [Profile Debug] Form value after population:', this.profileForm.value);
          console.warn('📝 [Profile Debug] Form raw value:', this.profileForm.getRawValue());
        },
        error: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('❌ [Profile Debug] Error loading user profile:', error);
          this.error = errorMessage || 'Failed to load user profile';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Populate profile form with user data
   */
  private populateForm(user: User): void {
    console.warn('📝 [Profile Debug] Populating form with user:', user);
    console.warn('📝 [Profile Debug] Username:', user.username || user.name);
    console.warn('📝 [Profile Debug] Email:', user.email);
    console.warn('📝 [Profile Debug] Role:', user.role);

    // Use setValue for disabled controls to ensure they update
    const usernameControl = this.profileForm.get('username');
    const emailControl = this.profileForm.get('email');
    const roleControl = this.profileForm.get('role');

    if (usernameControl) {
      usernameControl.setValue(user.username || user.name || '');
    }
    if (emailControl) {
      emailControl.setValue(user.email || '');
    }
    if (roleControl) {
      roleControl.setValue(this.formatRoleName(user.role) || 'Not Assigned');
    }

    console.warn('📝 [Profile Debug] Form controls after patch:', {
      username: this.profileForm.get('username')?.value,
      email: this.profileForm.get('email')?.value,
      role: this.profileForm.get('role')?.value,
      usernameDisabled: this.profileForm.get('username')?.disabled,
      emailDisabled: this.profileForm.get('email')?.disabled,
      roleDisabled: this.profileForm.get('role')?.disabled
    });

    // Force change detection
    this.cdr.detectChanges();
  }

  /**
   * Format role name for display
   */
  private formatRoleName(role?: string): string {
    if (!role) {return 'Not Assigned';}

    // Convert role ID to display name
    const roleMap: Record<string, string> = {
      'viewer': 'Viewer (Read-Only)',
      'editor': 'Editor',
      'admin': 'Administrator',
      'system-admin': 'System Administrator'
    };

    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  }

  /**
   * Update user profile (email)
   */
  updateProfile(): void {
    if (this.profileForm.invalid || !this.currentUser) {
      return;
    }

    this.saving = true;
    this.error = null;
    this.successMessage = null;
    this.cdr.markForCheck();

    const updateData = {
      email: this.profileForm.get('email')?.value,
    };

    this.userService
      .updateUser(this.currentUser._id, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Reload user data to get updated info
          this.loadCurrentUser();
          this.successMessage = 'Profile updated successfully';
          this.profileForm.patchValue({ currentPassword: '' });
          this.saving = false;
          this.cdr.markForCheck();

          setTimeout(() => {
            this.successMessage = null;
            this.cdr.markForCheck();
          }, 3000);
        },
        error: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          this.error = errorMessage || 'Failed to update profile';
          this.saving = false;
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Change user password
   */
  changePassword(): void {
    if (this.passwordForm.invalid || !this.currentUser) {
      return;
    }

    this.saving = true;
    this.error = null;
    this.successMessage = null;
    this.cdr.markForCheck();

    const passwordData = {
      password: this.passwordForm.get('newPassword')?.value,
    };

    this.userService
      .updateUser(this.currentUser._id, passwordData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Password changed successfully';
          this.passwordForm.reset();
          this.showPasswordChange = false;
          this.saving = false;
          this.cdr.markForCheck();

          setTimeout(() => {
            this.successMessage = null;
            this.cdr.markForCheck();
          }, 3000);
        },
        error: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          this.error = errorMessage || 'Failed to change password';
          this.saving = false;
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Toggle password change section
   */
  togglePasswordChange(): void {
    this.showPasswordChange = !this.showPasswordChange;
    if (this.showPasswordChange) {
      this.passwordForm.reset();
    }
  }

  /**
   * Get user permissions display
   */
  getUserPermissions(): string[] {
    return this.currentUser?.permissions || [];
  }

  /**
   * Get user role display
   */
  getUserRoleDisplay(): string {
    if (!this.currentUser) {
      return 'No Role';
    }
    const role = this.userService.getUserRole(this.currentUser);
    return role ? role.name : this.currentUser.role || 'Custom';
  }

  /**
   * Get user permission count
   */
  getUserPermissionCount(): number {
    return this.currentUser?.permissions?.length || 0;
  }

  /**
   * Submit profile form
   */
  onSubmitProfile(): void {
    this.updateProfile();
  }

  /**
   * Submit password form
   */
  onSubmitPassword(): void {
    this.changePassword();
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.router.navigate(['/admin/users']);
  }

  /**
   * Check if form field has error
   */
  hasFieldError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Get field error message
   */
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName} is required`;
    }
    if (field.errors['email']) {
      return 'Invalid email address';
    }
    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }
    if (field.errors['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return 'Invalid field';
  }

  /**
   * Open permissions modal
   */
  openPermissionsModal(): void {
    this.showPermissionsModal = true;
    this.cdr.markForCheck();
  }

  /**
   * Close permissions modal
   */
  closePermissionsModal(): void {
    this.showPermissionsModal = false;
    this.cdr.markForCheck();
  }

  /**
   * Get role details with permissions
   */
  getRoleDetails(): { name: string; description: string; permissions: string[] } | null {
    if (!this.currentUser || !this.currentUser.role) {
      return null;
    }

    const role = PREDEFINED_ROLES.find(r => r.id === this.currentUser?.role);
    if (role) {
      return {
        name: role.name,
        description: role.description,
        permissions: role.permissions
      };
    }

    // If role not found in predefined roles, use user's actual permissions
    return {
      name: this.formatRoleName(this.currentUser.role),
      description: 'Custom role with specific permissions',
      permissions: this.currentUser.permissions || []
    };
  }

  /**
   * Format permission for display
   */
  formatPermission(permission: string): { category: string; action: string; icon: string; color: string } {
    const parts = permission.split(':');
    const category = parts[0] || 'unknown';
    const action = parts[1] || 'unknown';

    const categoryMap: Record<string, { label: string; icon: string; color: string }> = {
      'user': { label: 'User Management', icon: 'fa-users', color: 'primary' },
      'device': { label: 'Device Management', icon: 'fa-microchip', color: 'info' },
      'model': { label: 'Model Management', icon: 'fa-cube', color: 'success' },
      'connection': { label: 'Connection Management', icon: 'fa-link', color: 'warning' },
      'attribute': { label: 'Attribute Management', icon: 'fa-tags', color: 'secondary' },
      'floor': { label: 'Floor Management', icon: 'fa-building', color: 'info' },
      'log': { label: 'Log Management', icon: 'fa-file-alt', color: 'dark' },
      'admin': { label: 'Administration', icon: 'fa-shield-alt', color: 'danger' },
      'system': { label: 'System Administration', icon: 'fa-cog', color: 'danger' }
    };

    const categoryInfo = categoryMap[category] || { label: category, icon: 'fa-question', color: 'secondary' };

    return {
      category: categoryInfo.label,
      action: action.charAt(0).toUpperCase() + action.slice(1),
      icon: categoryInfo.icon,
      color: categoryInfo.color
    };
  }

  /**
   * Group permissions by category
   */
  getGroupedPermissions(): Map<string, Array<{ action: string; permission: string; icon: string; color: string }>> {
    const roleDetails = this.getRoleDetails();
    if (!roleDetails) {
      return new Map();
    }

    const grouped = new Map<string, Array<{ action: string; permission: string; icon: string; color: string }>>();

    roleDetails.permissions.forEach(permission => {
      const formatted = this.formatPermission(permission);

      if (!grouped.has(formatted.category)) {
        grouped.set(formatted.category, []);
      }

      grouped.get(formatted.category)?.push({
        action: formatted.action,
        permission: permission,
        icon: formatted.icon,
        color: formatted.color
      });
    });

    return grouped;
  }
}
