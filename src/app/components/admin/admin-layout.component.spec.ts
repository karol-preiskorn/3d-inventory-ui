import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { AdminLayoutComponent } from './admin-layout.component';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({ template: '' })
class MockComponent {}

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let authService: any;
  let userService: any;
  let router: Router;

  beforeEach(async () => {
    authService = {
      isAuthenticated: jest.fn(),
      logout: jest.fn()
    };

    userService = {
      userHasPermission: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        AdminLayoutComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockComponent },
          { path: '', component: MockComponent }
        ])
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: UserService, useValue: userService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    authService.isAuthenticated.mockReturnValue(true);
    userService.userHasPermission.mockReturnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.sidebarCollapsed).toBe(false);
    expect(component.mobileMenuOpen).toBe(false);
    expect(component.currentUser).toBeNull();
  });

  it('should load user when authenticated', () => {
    authService.isAuthenticated.mockReturnValue(true);
    component.ngOnInit();
    expect(component.currentUser).toBeTruthy();
  });

  it('should not load user when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    component.ngOnInit();
    expect(component.currentUser).toBeNull();
  });

  it('should toggle sidebar', () => {
    component.sidebarCollapsed = false;
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBe(true);
  });

  it('should toggle mobile menu', () => {
    component.mobileMenuOpen = false;
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBe(true);
  });

  it('should close mobile menu', () => {
    component.mobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.mobileMenuOpen).toBe(false);
  });

  it('should logout and navigate', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to home', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();
    component.goToHome();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should check permissions with user', () => {
    component.currentUser = {
      _id: 'test',
      name: 'Test User',
      email: 'test@test.com',
      permissions: ['user_read']
    };
    userService.userHasPermission.mockReturnValue(true);
    const result = component.hasPermission('user_read');
    expect(result).toBe(true);
  });

  it('should return false for permissions without user', () => {
    component.currentUser = null;
    const result = component.hasPermission('user_read');
    expect(result).toBe(false);
  });

  it('should have navigation items', () => {
    expect(component.navigationItems.length).toBe(6);
    expect(component.navigationItems[0].path).toBe('/admin/users');
  });
});
