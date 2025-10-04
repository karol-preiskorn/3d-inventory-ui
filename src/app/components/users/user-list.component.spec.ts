import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogService } from '../../services/dialog.service';
import { Permission, User } from '../../shared/user';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jest.Mocked<UserService>;
  let authServiceSpy: jest.Mocked<AuthenticationService>;
  let dialogServiceSpy: jest.Mocked<DialogService>;

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
    const userSpy = {
      getUsers: jest.fn(),
      deleteUser: jest.fn(),
      getUserRole: jest.fn(),
      getPredefinedRoles: jest.fn(),
      userHasPermission: jest.fn()
    } as Partial<jest.Mocked<UserService>>;

    const authSpy = {
      hasPermission: jest.fn(),
      getCurrentUser: jest.fn()
    } as Partial<jest.Mocked<AuthenticationService>>;

    const dialogSpy = {
      alert: jest.fn(),
      confirm: jest.fn()
    } as Partial<jest.Mocked<DialogService>>;

    await TestBed.configureTestingModule({
      imports: [UserListComponent, RouterTestingModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthenticationService, useValue: authSpy },
        { provide: DialogService, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jest.Mocked<UserService>;
    authServiceSpy = TestBed.inject(AuthenticationService) as jest.Mocked<AuthenticationService>;
    dialogServiceSpy = TestBed.inject(DialogService) as jest.Mocked<DialogService>;

    // Set up default mocks
    userServiceSpy.getUsers.mockReturnValue(of(mockUsers));
    userServiceSpy.getPredefinedRoles.mockReturnValue([]);
    userServiceSpy.getUserRole.mockReturnValue({ id: 'viewer', name: 'Viewer', description: '', permissions: [] });
    authServiceSpy.hasPermission.mockReturnValue(true);
    authServiceSpy.getCurrentUser.mockReturnValue(mockUsers[0]);
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
    userServiceSpy.getUsers.mockReturnValue(throwError(() => new Error(errorMessage)));

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
    authServiceSpy.getCurrentUser.mockReturnValue(mockUsers[0]);

    expect(component.isCurrentUser(mockUsers[0])).toBeTruthy();
    expect(component.isCurrentUser(mockUsers[1])).toBeFalsy();
  });

  it('should delete user with confirmation', () => {
    dialogServiceSpy.confirm.mockReturnValue(of(true));
    userServiceSpy.deleteUser.mockReturnValue(of({ deletedCount: 1 }));
    authServiceSpy.getCurrentUser.mockReturnValue(mockUsers[0]);
    component.canDeleteUser = true;

    component.deleteUser(mockUsers[1]);

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith('2');
  });

  it('should not delete current user', () => {
    authServiceSpy.getCurrentUser.mockReturnValue(mockUsers[0]);
    component.canDeleteUser = true;

    component.deleteUser(mockUsers[0]);

    expect(dialogServiceSpy.alert).toHaveBeenCalledWith({
      title: 'Cannot Delete Own Account',
      message: 'You cannot delete your own account'
    });
    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
  });

  it('should not delete user without permission', () => {
    component.canDeleteUser = false;

    component.deleteUser(mockUsers[1]);

    expect(dialogServiceSpy.alert).toHaveBeenCalledWith({
      title: 'Permission Denied',
      message: 'You do not have permission to delete users'
    });
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
