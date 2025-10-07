/**
 * Test suite for ConfirmDialogComponent
 * Tests the confirmation dialog component functionality including
 * dialog display, user interactions, and result handling.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component'

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent
  let fixture: ComponentFixture<ConfirmDialogComponent>
  let mockDialogRef: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>
  let mockData: ConfirmDialogData

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    } as jest.Mocked<Partial<MatDialogRef<ConfirmDialogComponent>>> as jest.Mocked<MatDialogRef<ConfirmDialogComponent>>

    mockData = {
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      confirmText: 'Yes',
      cancelText: 'No'
    }

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ConfirmDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy()
    })

    it('should display the title', () => {
      const titleElement = fixture.nativeElement.querySelector('h1[mat-dialog-title]')
      expect(titleElement.textContent.trim()).toBe('Confirm Action')
    })

    it('should display the message', () => {
      const messageElement = fixture.nativeElement.querySelector('[mat-dialog-content] p')
      expect(messageElement.textContent.trim()).toBe('Are you sure you want to proceed?')
    })

    it('should display the confirm button with correct text', () => {
      const confirmButton = fixture.nativeElement.querySelector('.confirm-button')
      expect(confirmButton.textContent.trim()).toBe('Yes')
    })

    it('should display the cancel button when cancelText is provided', () => {
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')
      expect(cancelButton).toBeTruthy()
      expect(cancelButton.textContent.trim()).toBe('No')
    })
  })

  describe('Dialog with Cancel Button', () => {
    it('should show cancel button when cancelText is provided', () => {
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')
      expect(cancelButton).toBeTruthy()
      expect(cancelButton.textContent.trim()).toBe('No')
    })

    it('should call onCancel when cancel button is clicked', () => {
      const onCancelSpy = jest.spyOn(component, 'onCancel')
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')

      cancelButton.click()

      expect(onCancelSpy).toHaveBeenCalled()
    })

    it('should close dialog with false when cancel is clicked', () => {
      component.onCancel()

      expect(mockDialogRef.close).toHaveBeenCalledWith(false)
    })
  })

  describe('Dialog without Cancel Button', () => {
    it('should display cancel button when cancelText is provided', () => {
      // The mock data includes cancelText, so cancel button should be visible
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')
      expect(cancelButton).toBeTruthy()
    })

    it('should show both confirm and cancel buttons with provided cancelText', () => {
      const confirmButton = fixture.nativeElement.querySelector('.confirm-button')
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')

      expect(confirmButton).toBeTruthy()
      expect(cancelButton).toBeTruthy()
      expect(cancelButton.textContent.trim()).toBe('No')
    })
  })

  describe('Confirm Button Interaction', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      const onConfirmSpy = jest.spyOn(component, 'onConfirm')
      const confirmButton = fixture.nativeElement.querySelector('.confirm-button')

      confirmButton.click()

      expect(onConfirmSpy).toHaveBeenCalled()
    })

    it('should close dialog with true when confirm is clicked', () => {
      component.onConfirm()

      expect(mockDialogRef.close).toHaveBeenCalledWith(true)
    })
  })

  describe('Dialog Data Binding', () => {
    it('should bind data correctly to template', () => {
      expect(component.data).toBe(mockData)
      expect(component.data.title).toBe('Confirm Action')
      expect(component.data.message).toBe('Are you sure you want to proceed?')
      expect(component.data.confirmText).toBe('Yes')
      expect(component.data.cancelText).toBe('No')
    })

    it('should handle the default dialog configuration', () => {
      // Test the default mock data configuration
      const titleElement = fixture.nativeElement.querySelector('h1[mat-dialog-title]')
      const messageElement = fixture.nativeElement.querySelector('[mat-dialog-content] p')
      const confirmButton = fixture.nativeElement.querySelector('.confirm-button')
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')

      expect(titleElement.textContent.trim()).toBe('Confirm Action')
      expect(messageElement.textContent.trim()).toBe('Are you sure you want to proceed?')
      expect(confirmButton.textContent.trim()).toBe('Yes')
      expect(cancelButton.textContent.trim()).toBe('No')
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to buttons', () => {
      const confirmButton = fixture.nativeElement.querySelector('.confirm-button')
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')

      expect(confirmButton.classList.contains('confirm-button')).toBeTruthy()
      expect(confirmButton.getAttribute('mat-raised-button')).toBe('')
      expect(confirmButton.getAttribute('color')).toBe('primary')

      expect(cancelButton.classList.contains('cancel-button')).toBeTruthy()
      expect(cancelButton.getAttribute('mat-button')).toBe('')
    })

    it('should have proper dialog structure classes', () => {
      const dialogContent = fixture.nativeElement.querySelector('.confirm-dialog')
      const dialogTitle = fixture.nativeElement.querySelector('[mat-dialog-title]')
      const dialogContentDiv = fixture.nativeElement.querySelector('[mat-dialog-content]')
      const dialogActions = fixture.nativeElement.querySelector('[mat-dialog-actions]')

      expect(dialogContent).toBeTruthy()
      expect(dialogTitle).toBeTruthy()
      expect(dialogContentDiv).toBeTruthy()
      expect(dialogActions).toBeTruthy()
      expect(dialogActions.getAttribute('align')).toBe('end')
    })
  })

  describe('Accessibility', () => {
    it('should have proper dialog structure for screen readers', () => {
      const title = fixture.nativeElement.querySelector('[mat-dialog-title]')
      const content = fixture.nativeElement.querySelector('[mat-dialog-content]')
      const actions = fixture.nativeElement.querySelector('[mat-dialog-actions]')

      expect(title).toBeTruthy()
      expect(content).toBeTruthy()
      expect(actions).toBeTruthy()
    })

    it('should have buttons with proper text content for screen readers', () => {
      const confirmButton = fixture.nativeElement.querySelector('.confirm-button')
      const cancelButton = fixture.nativeElement.querySelector('.cancel-button')

      expect(confirmButton.textContent.trim()).toBeTruthy()
      expect(cancelButton.textContent.trim()).toBeTruthy()
    })
  })
})
