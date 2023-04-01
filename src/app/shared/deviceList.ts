import { Device } from './device'

// @TODO #2: Create class deviceLists operated on list of devices
// @TODO #3: Get list/Find in list

export class DeviceList {
  deviceList: Device[] = []

  print() {
    this.deviceList.forEach((element) => {
      element.print()
    })
  }

  get(): Device[] {
    return this.deviceList
  }

  push(device: Device) {
    this.deviceList.push(device)
  }
}
