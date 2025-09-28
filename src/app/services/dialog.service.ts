import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';

/**
 * Dialog service for showing confirmation dialogs
 */

export interface AlertDialogData {
  title: string;
  message: string;
  buttonText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Shows a confirmation dialog
   */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: data.title,
        message: data.message,
        confirmText: data.confirmText || 'Confirm',
        cancelText: data.cancelText || 'Cancel'
      },
      minWidth: '300px',
      maxWidth: '500px'
    });

    return dialogRef.afterClosed();
  }

  /**
   * Shows an alert dialog
   */
  alert(data: AlertDialogData): Observable<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: data.title,
        message: data.message,
        confirmText: data.buttonText || 'OK',
        cancelText: null // Hide cancel button for alerts
      },
      minWidth: '300px',
      maxWidth: '500px'
    });

    return dialogRef.afterClosed();
  }
}
