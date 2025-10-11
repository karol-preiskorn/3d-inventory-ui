import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { User } from '../../shared/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogService } from '../../services/dialog.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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

    // Use setValue for disabled controls to ensure they update
    const usernameControl = this.profileForm.get('username');
    const emailControl = this.profileForm.get('email');

    if (usernameControl) {
      usernameControl.setValue(user.username || user.name || '');
    }
    if (emailControl) {
      emailControl.setValue(user.email || '');
    }

    console.warn('📝 [Profile Debug] Form controls after patch:', {
      username: this.profileForm.get('username')?.value,
      email: this.profileForm.get('email')?.value,
      usernameDisabled: this.profileForm.get('username')?.disabled,
      emailDisabled: this.profileForm.get('email')?.disabled
    });

    // Force change detection
    this.cdr.detectChanges();
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
}
