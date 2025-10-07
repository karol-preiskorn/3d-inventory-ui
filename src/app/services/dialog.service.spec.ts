/**
 * Test suite for DialogService
 * Tests dialog service functionality for confirmation and alert dialogs.
 */

import { TestBed } from '@angular/core/testing'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { of } from 'rxjs'

import { DialogService, AlertDialogData } from './dialog.service'
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component'

describe('DialogService', () => {
  let service: DialogService
  let matDialog: jest.Mocked<MatDialog>
  let mockDialogRef: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>

  beforeEach(() => {
    mockDialogRef = {
      afterClosed: jest.fn()
    } as jest.Mocked<Partial<MatDialogRef<ConfirmDialogComponent>>> as jest.Mocked<MatDialogRef<ConfirmDialogComponent>>

    const matDialogSpy = {
      open: jest.fn().mockReturnValue(mockDialogRef)
    } as jest.Mocked<Partial<MatDialog>>

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    })

    service = TestBed.inject(DialogService)
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('Confirmation Dialog', () => {
    it('should open confirmation dialog with default texts', () => {
      const confirmData: ConfirmDialogData = {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        confirmText: 'Confirm'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(true))

      service.confirm(confirmData)

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Delete Item',
          message: 'Are you sure you want to delete this item?',
          confirmText: 'Confirm',
          cancelText: 'Cancel'
        },
        minWidth: '300px',
        maxWidth: '500px'
      })
    })

    it('should open confirmation dialog with custom texts', () => {
      const confirmData: ConfirmDialogData = {
        title: 'Save Changes',
        message: 'Do you want to save your changes?',
        confirmText: 'Save',
        cancelText: 'Discard'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(true))

      service.confirm(confirmData)

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Save Changes',
          message: 'Do you want to save your changes?',
          confirmText: 'Save',
          cancelText: 'Discard'
        },
        minWidth: '300px',
        maxWidth: '500px'
      })
    })

    it('should return observable that emits true when confirmed', () => {
      const confirmData: ConfirmDialogData = {
        title: 'Confirm Action',
        message: 'Please confirm this action',
        confirmText: 'Confirm'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(true))

      const result = service.confirm(confirmData)

      result.subscribe(confirmed => {
        expect(confirmed).toBe(true)
      })

      expect(mockDialogRef.afterClosed).toHaveBeenCalled()
    })

    it('should return observable that emits false when cancelled', () => {
      const confirmData: ConfirmDialogData = {
        title: 'Confirm Action',
        message: 'Please confirm this action',
        confirmText: 'Confirm'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(false))

      const result = service.confirm(confirmData)

      result.subscribe(confirmed => {
        expect(confirmed).toBe(false)
      })

      expect(mockDialogRef.afterClosed).toHaveBeenCalled()
    })

    it('should handle undefined result (dialog closed without selection)', () => {
      const confirmData: ConfirmDialogData = {
        title: 'Confirm Action',
        message: 'Please confirm this action',
        confirmText: 'Confirm'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(undefined))

      const result = service.confirm(confirmData)

      result.subscribe(confirmed => {
        expect(confirmed).toBeUndefined()
      })
    })
  })

  describe('Alert Dialog', () => {
    it('should open alert dialog with default button text', () => {
      const alertData: AlertDialogData = {
        title: 'Error',
        message: 'An error occurred while processing your request.'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(undefined))

      service.alert(alertData)

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Error',
          message: 'An error occurred while processing your request.',
          confirmText: 'OK',
          cancelText: null
        },
        minWidth: '300px',
        maxWidth: '500px'
      })
    })

    it('should open alert dialog with custom button text', () => {
      const alertData: AlertDialogData = {
        title: 'Success',
        message: 'Operation completed successfully.',
        buttonText: 'Got it'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(undefined))

      service.alert(alertData)

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Success',
          message: 'Operation completed successfully.',
          confirmText: 'Got it',
          cancelText: null
        },
        minWidth: '300px',
        maxWidth: '500px'
      })
    })

    it('should return observable when alert is closed', () => {
      const alertData: AlertDialogData = {
        title: 'Information',
        message: 'This is an informational message.'
      }

      mockDialogRef.afterClosed.mockReturnValue(of(undefined))

      const result = service.alert(alertData)

      result.subscribe(response => {
        expect(response).toBeUndefined()
      })

      expect(mockDialogRef.afterClosed).toHaveBeenCalled()
    })
  })

  describe('Dialog Configuration', () => {
    it('should configure dialog with proper dimensions for confirmation', () => {
      const confirmData: ConfirmDialogData = {
        title: 'Test',
        message: 'Test message',
        confirmText: 'OK'
      }

      service.confirm(confirmData)

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Test',
          message: 'Test message',
          confirmText: 'OK',
          cancelText: 'Cancel'
        },
        minWidth: '300px',
        maxWidth: '500px'
      })
    })

    it('should configure dialog with proper dimensions for alert', () => {
      const alertData: AlertDialogData = {
        title: 'Test',
        message: 'Test message'
      }

      service.alert(alertData)

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Test',
          message: 'Test message',
          confirmText: 'OK',
          cancelText: null
        },
        minWidth: '300px',
        maxWidth: '500px'
      })
    })
  })
})
