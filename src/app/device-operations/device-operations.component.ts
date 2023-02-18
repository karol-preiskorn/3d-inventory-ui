import { Component } from '@angular/core';
import { devices } from '../devices';

@Component({
  selector: 'app-device-operations',
  templateUrl: './device-operations.component.html',
  styleUrls: ['./device-operations.component.scss']
})
export class DeviceOperationsComponent {
  devices = devices;

  share() {
    window.alert('The device has been shared!');
  }
}
