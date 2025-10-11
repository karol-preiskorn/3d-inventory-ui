import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CreateUserRequest, Permission, Role, UpdateUserRequest, User } from '../../shared/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  isEditMode = false;
  userId: string | null = null;
  currentUser: User | null = null;

  // Permissions and roles
  availablePermissions: Permission[] = [];
  predefinedRoles: Role[] = [];
  selectedRole: string = '';

  // Form validation
  validationErrors: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.createForm();
    this.availablePermissions = this.userService.getAvailablePermissions();
    this.predefinedRoles = this.userService.getPredefinedRoles();
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode) {
      this.loadUser();
    } else {
      this.initializeNewUser();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create reactive form
   */
  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.minLength(6), Validators.maxLength(255)]],
      confirmPassword: [''],
      permissions: this.fb.array([]),
      role: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Password match validator
   */
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Get permissions FormArray
   */
  get permissionsArray(): FormArray {
    return this.userForm.get('permissions') as FormArray;
  }

  /**
   * Initialize form for new user
   */
  private initializeNewUser(): void {
    // Make password required for new users
    this.userForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(255)
    ]);
    this.userForm.get('password')?.updateValueAndValidity();

    this.initializePermissions();
  }

  /**
   * Load existing user for editing
   */
  private loadUser(): void {
    if (!this.userId) {return;}

    this.loading = true;
    this.error = null;

    this.userService.getUserById(this.userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.populateForm(user);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load user';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  /**
   * Populate form with user data
   */
  private populateForm(user: User): void {
    this.userForm.patchValue({
      username: user.username || user.name,
      email: user.email,
      role: user.role || ''
    });

    this.initializePermissions(user.permissions);

    // Set selected role if user has one
    if (user.role) {
      this.selectedRole = user.role;
    }
  }

  /**
   * Initialize permissions checkboxes
   */
  private initializePermissions(userPermissions: string[] = []): void {
    const permissionsArray = this.permissionsArray;

    // Clear existing controls
    while (permissionsArray.length) {
      permissionsArray.removeAt(0);
    }

    // Add controls for each permission
    this.availablePermissions.forEach(permission => {
      const isChecked = userPermissions.includes(permission);
      permissionsArray.push(this.fb.control(isChecked));
    });
  }

  /**
   * Handle role selection
   */
  onRoleChange(): void {
    const selectedRole = this.userForm.get('role')?.value;
    if (!selectedRole) {return;}

    const rolePermissions = this.userService.getPermissionsForRole(selectedRole);

    // Update permissions array based on selected role
    this.availablePermissions.forEach((permission, index) => {
      const shouldBeChecked = rolePermissions.includes(permission);
      this.permissionsArray.at(index).setValue(shouldBeChecked);
    });

    this.selectedRole = selectedRole;
  }

  /**
   * Get selected permissions
   */
  private getSelectedPermissions(): string[] {
    const selectedPermissions: string[] = [];

    this.permissionsArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedPermissions.push(this.availablePermissions[index]);
      }
    });

    return selectedPermissions;
  }

  /**
   * Validate form data
   */
  private validateForm(): boolean {
    this.validationErrors = [];

    if (this.userForm.invalid) {
      if (this.userForm.get('username')?.errors) {
        this.validationErrors.push('Username is required and must be at least 2 characters');
      }
      if (this.userForm.get('email')?.errors) {
        this.validationErrors.push('Please enter a valid email address');
      }
      if (this.userForm.get('password')?.errors) {
        if (this.isEditMode) {
          this.validationErrors.push('Password must be at least 6 characters (leave empty to keep current)');
        } else {
          this.validationErrors.push('Password is required and must be at least 6 characters');
        }
      }
      if (this.userForm.errors?.['passwordMismatch']) {
        this.validationErrors.push('Passwords do not match');
      }
    }

    const selectedPermissions = this.getSelectedPermissions();
    if (selectedPermissions.length === 0) {
      this.validationErrors.push('At least one permission must be selected');
    }

    return this.validationErrors.length === 0;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (!this.validateForm()) {
      this.error = 'Please fix the validation errors below';
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    const formData = this.userForm.value;
    const selectedPermissions = this.getSelectedPermissions();

    if (this.isEditMode) {
      this.updateUser(formData, selectedPermissions);
    } else {
      this.createUser(formData, selectedPermissions);
    }
  }

  /**
   * Create new user
   */
  private createUser(formData: Record<string, unknown>, permissions: string[]): void {
    const createRequest: CreateUserRequest = {
      username: (formData.username as string).trim(),
      email: (formData.email as string).trim().toLowerCase(),
      password: formData.password as string,
      permissions: permissions,
      role: formData.role as string || undefined
    };

    this.userService.createUser(createRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (_response) => {
        this.success = 'User created successfully';
        this.saving = false;

        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.error = error.message || 'Failed to create user';
        this.saving = false;
        console.error('Error creating user:', error);
      }
    });
  }

  /**
   * Update existing user
   */
  private updateUser(formData: Record<string, unknown>, permissions: string[]): void {
    if (!this.userId) {return;}

    const updateRequest: UpdateUserRequest = {
      username: (formData.username as string).trim(),
      email: (formData.email as string).trim().toLowerCase(),
      permissions: permissions,
      role: formData.role as string || undefined
    };

    // Only include password if it's provided
    if (formData.password && (formData.password as string).trim()) {
      updateRequest.password = formData.password as string;
    }

    this.userService.updateUser(this.userId, updateRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (_response) => {
        this.success = 'User updated successfully';
        this.saving = false;

        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.error = error.message || 'Failed to update user';
        this.saving = false;
        console.error('Error updating user:', error);
      }
    });
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  /**
   * Reset form
   */
  onReset(): void {
    if (this.isEditMode && this.currentUser) {
      this.populateForm(this.currentUser);
    } else {
      this.userForm.reset();
      this.initializePermissions();
    }

    this.selectedRole = '';
    this.error = null;
    this.success = null;
    this.validationErrors = [];
  }

  /**
   * Check if permission is checked
   */
  isPermissionChecked(index: number): boolean {
    return this.permissionsArray.at(index)?.value || false;
  }

  /**
   * Toggle permission
   */
  togglePermission(index: number): void {
    const control = this.permissionsArray.at(index);
    control.setValue(!control.value);

    // Clear role selection if manually changing permissions
    this.selectedRole = '';
  }

  /**
   * Get permission display name
   */
  getPermissionDisplayName(permission: Permission): string {
    return permission.replace(/[_:]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get permission category
   */
  getPermissionCategory(permission: Permission): string {
    const parts = permission.split(':');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }

  /**
   * Group permissions by category
   */
  getGroupedPermissions(): { [category: string]: Permission[] } {
    const grouped: { [category: string]: Permission[] } = {};

    this.availablePermissions.forEach(permission => {
      const category = this.getPermissionCategory(permission);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });

    return grouped;
  }

  /**
   * Get form field error message
   */
  getFieldError(fieldName: string): string | null {
    const field = this.userForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`;
      }
      if (field.errors?.['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${maxLength} characters`;
      }
    }
    return null;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Track by function for permissions
   */
  trackByPermission(index: number, permission: Permission): string {
    return permission;
  }
}
