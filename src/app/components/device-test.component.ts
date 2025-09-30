import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../services/device.service';
import { Device } from '../shared/device';

@Component({
  selector: 'app-device-test',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-fluid">
      <h3>🧪 Device API Integration Test</h3>

      <div class="alert alert-info">
        <strong>Test Status:</strong> {{ testStatus }}
      </div>

      @if (loading) {
        <div class="alert alert-warning">
          <i class="bi bi-clock"></i> Loading devices from API...
        </div>
      }

      @if (error) {
        <div class="alert alert-danger">
          <strong>❌ Error:</strong> {{ error }}
        </div>
      }

      @if (devices.length > 0) {
        <div class="alert alert-success">
          <strong>✅ Success!</strong> Loaded {{ devices.length }} devices from API
        </div>

        <h4>🔍 API Response Analysis:</h4>
        <ul class="list-group">
          <li class="list-group-item">
            <strong>Total Devices:</strong> {{ devices.length }}
          </li>
          <li class="list-group-item">
            <strong>First Device:</strong> {{ devices[0]?.name || 'N/A' }} (ID: {{ devices[0]?._id || 'N/A' }})
          </li>
          <li class="list-group-item">
            <strong>Device Service Response Structure:</strong> Array of Device objects
          </li>
          <li class="list-group-item">
            <strong>Sample Position:</strong> @if (devices[0]) { ({{ devices[0].position.x }}, {{ devices[0].position.y }}, {{ devices[0].position.h }}) } @else { N/A }
          </li>
        </ul>

        <h4>📋 Device List Preview:</h4>
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Model ID</th>
              <th>Position</th>
              <th>Attributes</th>
            </tr>
          </thead>
          <tbody>
            @for (device of devices.slice(0, 5); track device._id) {
              <tr>
                <td>{{ device.name }}</td>
                <td><small class="text-muted">{{ device._id }}</small></td>
                <td><small class="text-muted">{{ device.modelId }}</small></td>
                <td>({{ device.position.x }}, {{ device.position.y }}, {{ device.position.h }})</td>
                <td>{{ device.attributes?.length || 0 }} attrs</td>
              </tr>
            }
          </tbody>
        </table>
      }

      <div class="mt-3">
        <button class="btn btn-primary" (click)="testDeviceAPI()">
          🔄 Refresh Test
        </button>
        <a class="btn btn-secondary ms-2" href="/device-list">
          📋 Go to Device List
        </a>
      </div>
    </div>
  `
})
export class DeviceTestComponent implements OnInit {
  devices: Device[] = [];
  loading = false;
  error: string | null = null;
  testStatus = 'Not started';

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.testDeviceAPI();
  }

  testDeviceAPI() {
    this.loading = true;
    this.error = null;
    this.testStatus = 'Running API test...';

    console.warn('DeviceTestComponent: Starting API test');

    this.deviceService.GetDevices().subscribe({
      next: (data: Device[]) => {
        console.warn('DeviceTestComponent: Received data:', data);
        this.devices = data;
        this.loading = false;
        this.testStatus = `✅ Success - Loaded ${data.length} devices`;
      },
      error: (err) => {
        console.error('DeviceTestComponent: Error:', err);
        this.error = err.message || 'Unknown error occurred';
        this.loading = false;
        this.testStatus = '❌ Failed';
      }
    });
  }
}
