import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Device } from '../device'
import { DeviceList } from '../deviceList'

@Component({
  selector: 'app-device-operations',
  templateUrl: './device-operations.component.html',
  styleUrls: ['./device-operations.component.scss']
})

export class DeviceOperationsComponent {
  // deviceList = DeviceList;
  deviceList: Device[] = [];
  nameControl = new FormControl('');

  constructor () {
    console.log("🐛 Generate devicesList")
    for (let index = 0; index < 10; index++) {
      var deviceTmp = new Device()
      this.deviceList.push(deviceTmp)
    }
  }

  addDevice(){
    window.alert('The device has been shared!');
  }

  share() {
    window.alert('The device has been shared!');
  }
}
