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

  // @TODO: #1 Generate 100 random records
  //

  // console.log('Generate devicesList')
  // export const devicesList: Device[] = []

  // try {
  //   for (let index = 0; index < 10; index++) {
  //     const deviceTmp = new Device()
  //     devicesList.push(deviceTmp)
  //   }
  // } catch (err) {
  //   console.log('🐛 Generate devicesList', err)
  // }

  // console.log('Print devicesList')
  // devicesList.forEach((element, i) => {
  //   console.log(i + 1, element.getString())
  // })
}
