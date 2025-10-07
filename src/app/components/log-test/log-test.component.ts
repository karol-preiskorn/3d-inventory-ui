import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Log, LogService } from '../../services/log.service';

@Component({
  selector: 'app-log-test',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Log API Integration Test</h2>
      <div class="row">
        <div class="col-md-6">
          <h4>API Status</h4>
          <div [class]="apiStatus.includes('✅') ? 'alert alert-success' : 'alert alert-danger'">
            {{ apiStatus }}
          </div>
        </div>
        <div class="col-md-6">
          <h4>Actions</h4>
          <button class="btn btn-primary me-2" (click)="testGetAllLogs()">Test Get All Logs</button>
          <button class="btn btn-secondary me-2" (click)="testGetComponentLogs()">Test Component Logs</button>
          <button class="btn btn-info" (click)="testCreateLog()">Test Create Log</button>
        </div>
      </div>

      <div class="mt-4" *ngIf="logs.length > 0">
        <h4>Recent Log Entries ({{ logs.length }} total)</h4>
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Component</th>
                <th>Operation</th>
                <th>Object ID</th>
                <th>Message Preview</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of logs.slice(0, 10)">
                <td>{{ log.date }}</td>
                <td>{{ log.component }}</td>
                <td>{{ log.operation }}</td>
                <td>{{ log.objectId || 'N/A' }}</td>
                <td>{{ getMessagePreview(log) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-4" *ngIf="errorMessage">
        <div class="alert alert-danger">
          <strong>Error:</strong> {{ errorMessage }}
        </div>
      </div>
    </div>
  `
})
export class LogTestComponent {
  logs: Log[] = [];
  apiStatus = '⏳ Ready to test...';
  errorMessage = '';

  constructor(private logService: LogService) {}

  testGetAllLogs(): void {
    this.apiStatus = '⏳ Testing GetAllLogs...';
    this.errorMessage = '';

    this.logService.GetLogs().subscribe({
      next: (data: Log[]) => {
        this.logs = data;
        this.apiStatus = `✅ GetAllLogs successful: Retrieved ${data.length} log entries`;
        console.warn('✅ GetAllLogs test passed:', data.length, 'logs retrieved');
      },
      error: (error) => {
        this.apiStatus = '❌ GetAllLogs failed';
        this.errorMessage = error.message || 'Unknown error occurred';
        console.error('❌ GetAllLogs test failed:', error);
      }
    });
  }

  testGetComponentLogs(): void {
    this.apiStatus = '⏳ Testing GetComponentLogs for devices...';
    this.errorMessage = '';

    this.logService.GetComponentLogs('devices').subscribe({
      next: (data: Log[]) => {
        this.logs = data;
        this.apiStatus = `✅ GetComponentLogs successful: Retrieved ${data.length} device log entries`;
        console.warn('✅ GetComponentLogs test passed:', data.length, 'device logs retrieved');
      },
      error: (error) => {
        this.apiStatus = '❌ GetComponentLogs failed';
        this.errorMessage = error.message || 'Unknown error occurred';
        console.error('❌ GetComponentLogs test failed:', error);
      }
    });
  }

  testCreateLog(): void {
    this.apiStatus = '⏳ Testing CreateLog...';
    this.errorMessage = '';

    const testLogData = {
      operation: 'Test',
      component: 'devices',
      message: JSON.stringify({
        test: true,
        timestamp: new Date().toISOString(),
        source: 'log-test-component'
      })
    };

    this.logService.CreateLog(testLogData).subscribe({
      next: (result) => {
        this.apiStatus = `✅ CreateLog successful: Log created with ID ${result._id}`;
        console.warn('✅ CreateLog test passed:', result);
        // Refresh the logs to show the new entry
        this.testGetAllLogs();
      },
      error: (error) => {
        this.apiStatus = '❌ CreateLog failed';
        this.errorMessage = error.message || 'Unknown error occurred';
        console.error('❌ CreateLog test failed:', error);
      }
    });
  }

  getMessagePreview(log: Log): string {
    try {
      const message = typeof log.message === 'string' ? JSON.parse(log.message) : log.message;
      const keys = Object.keys(message).slice(0, 2);
      return keys.map(key => `${key}: ${message[key]}`).join(', ') + (Object.keys(message).length > 2 ? '...' : '');
    } catch {
      return typeof log.message === 'string' ? (log.message as string).substring(0, 50) + '...' : 'Complex object';
    }
  }
}
