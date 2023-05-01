/*
 * File:        /src/app/tmp/find.ts
 * Description: find object in array
 * Used by:     testing TS find function
 * Todo:        move this function to Karma test unit
 * Dependency:
 *
 * Date        By     Comments
 * ----------  -----  -------------------------------------------------------
 * 2023-05-01  C2RLO  Cleanup move all test here
 * 2023-02-19  C2RLO  Init
 */

import { DeviceTypeDict } from 'src/app/shared/deviceTypes'
import { DeviceTypeListType } from 'src/app/shared/deviceTypes'

const inventory: { name: string; quantity: number }[] = [
  { name: 'apples', quantity: 2 },
  { name: 'bananas', quantity: 0 },
  { name: 'cherries', quantity: 5 },
]

function findCherries(fruit: { name: string; quantity: number }) {
  return fruit.name === 'x'
}

inventory.find(findCherries) // { name: 'cherries', quantity: 5 }

/* OR */

inventory.find((e) => e.name === 'bananas') // { name: 'apples', quantity: 2 }

/**
 *
 *
 * @param {string} message
 * @memberof LogService
 */
// add({
//   message,
//   category,
//   component,
// }: {
//   message: string
//   category: string
//   component: string
// }) {
//   this.id = this.id + 1
//   const log: Log = {
//     id: this.id,
//     date: getDateString(),
//     category: category,
//     component: component,
//     message: message,
//   }
//   this.logs.push(log)
// }

const devicesT = new DeviceTypeDict()
const f = devicesT.findTypeByName('Probe')
console.log('-->', f)

/**
 * Function loop over the array, then check if the type property is equal to the property in each object of the array
 *
 * @param {Array<deviceTypeType>} arr
 * @param {deviceTypeType} obj
 */
function findObjinDeviceTypes(
  arr: Array<DeviceTypeListType>,
  obj: DeviceTypeListType
) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === obj.name) {
      console.log('-->', obj)
    }
  }
}
// test findObjinDeviceTypes
findObjinDeviceTypes(devicesT.list, { name: 'Workstations', description: '' })
