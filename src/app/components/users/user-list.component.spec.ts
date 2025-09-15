import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User, Permission } from '../../shared/user';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const mockUsers: User[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      permissions: [Permission.USER_READ, Permission.DEVICE_READ]
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      permissions: [Permission.ADMIN_FULL]
    },
    {
      _id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      permissions: [Permission.USER_READ]
    }
  ];

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'deleteUser',
      'getUserRole',
      'getPredefinedRoles',
      'userHasPermission'
    ]);
    const authSpy = jasmine.createSpyObj('AuthenticationService', [
      'hasPermission',
      'getCurrentUser'
    ]);

    await TestBed.configureTestingModule({
      imports: [UserListComponent, RouterTestingModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthenticationService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

    // Set up default mocks
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.getPredefinedRoles.and.returnValue([]);
    userServiceSpy.getUserRole.and.returnValue({ id: 'viewer', name: 'Viewer', description: '', permissions: [] });
    authServiceSpy.hasPermission.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue(mockUsers[0]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.loading).toBeFalsy();
  });

  it('should handle error when loading users', () => {
    const errorMessage = 'Failed to load users';
    userServiceSpy.getUsers.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalsy();
  });

  it('should filter users by search query', () => {
    component.users = mockUsers;
    component.searchQuery = 'john';

    component.applyFiltersAndSort();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should sort users by name', () => {
    component.users = mockUsers;
    component.sortBy = 'name';
    component.sortDirection = 'asc';

    component.applyFiltersAndSort();

    expect(component.filteredUsers[0].name).toBe('Bob Wilson');
    expect(component.filteredUsers[1].name).toBe('Jane Smith');
    expect(component.filteredUsers[2].name).toBe('John Doe');
  });

  it('should change sort direction when clicking same column', () => {
    component.sortBy = 'name';
    component.sortDirection = 'asc';

    component.sort('name');

    expect(component.sortDirection).toBe('desc');
  });

  it('should change sort column and reset direction', () => {
    component.sortBy = 'name';
    component.sortDirection = 'desc';

    component.sort('email');

    expect(component.sortBy).toBe('email');
    expect(component.sortDirection).toBe('asc');
  });

  it('should handle pagination correctly', () => {
    component.users = mockUsers;
    component.pageSize = 2;
    component.applyFiltersAndSort();

    expect(component.totalPages).toBe(2);
    expect(component.getPaginatedUsers().length).toBe(2);

    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(component.getPaginatedUsers().length).toBe(1);
  });

  it('should identify current user correctly', () => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUsers[0]);

    expect(component.isCurrentUser(mockUsers[0])).toBeTruthy();
    expect(component.isCurrentUser(mockUsers[1])).toBeFalsy();
  });

  it('should delete user with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceSpy.deleteUser.and.returnValue(of({ deletedCount: 1 }));
    authServiceSpy.getCurrentUser.and.returnValue(mockUsers[0]);
    component.canDeleteUser = true;

    component.deleteUser(mockUsers[1]);

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith('2');
  });

  it('should not delete current user', () => {
    spyOn(window, 'alert');
    authServiceSpy.getCurrentUser.and.returnValue(mockUsers[0]);
    component.canDeleteUser = true;

    component.deleteUser(mockUsers[0]);

    expect(window.alert).toHaveBeenCalledWith('You cannot delete your own account');
    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
  });

  it('should not delete user without permission', () => {
    spyOn(window, 'alert');
    component.canDeleteUser = false;

    component.deleteUser(mockUsers[1]);

    expect(window.alert).toHaveBeenCalledWith('You do not have permission to delete users');
    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
  });

  it('should clear filters', () => {
    component.searchQuery = 'test';
    component.selectedRole = 'admin';
    component.currentPage = 2;

    component.clearFilters();

    expect(component.searchQuery).toBe('');
    expect(component.selectedRole).toBe('');
    expect(component.currentPage).toBe(1);
  });

  it('should get correct page numbers for pagination', () => {
    component.totalPages = 10;
    component.currentPage = 5;

    const pageNumbers = component.getPageNumbers();

    expect(pageNumbers).toEqual([3, 4, 5, 6, 7]);
  });

  it('should track users by ID', () => {
    const user = mockUsers[0];
    const result = component.trackByUserId(0, user);

    expect(result).toBe(user._id);
  });

  it('should refresh users list', () => {
    component.refresh();

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
  });
});
