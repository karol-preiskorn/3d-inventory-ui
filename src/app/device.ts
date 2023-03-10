/*
* File:        /src/app/devices.ts
* Description: Main class operating on devices. Structure data accessed vi Oracle DB/Neo4j
* Used by:
* Dependency:
*
* Date        By     Comments
* ----------  -----  ---------------------------------------------------------
* 2023-02-18  C2RLO  Init
*/
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator"
import { v4 as uuidv4 } from 'uuid'
import { DeviceCategory, DeviceCategoryInterfance } from './deviceCategories'
import { DeviceTypes } from './deviceType'

export class Device {

  id: string
  name: string
  type: string
  category: DeviceCategoryInterfance

  constructor() {
    this.id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-'
    }) // big_red_donkey
    this.type = new DeviceTypes().getRandom()
    this.category = new DeviceCategory().getRandom()
  }

  print() {
    console.log("-->[device] id: " + this.id + ", name: " + this.name + ", type: " + this.type + ", category: " + this.category.Category)
  }

  getString(): string {
    return "-->[device] id: " + this.id + ", name: " + this.name + ", type: " + this.type + ", category: " + this.category.Category
  }
}

// @TODO: #1 Generate 100 random records
//
console.log("Generate devicesList")
export var devicesList: Device[] = []

try {
  for (let index = 0; index < 10; index++) {
    var deviceTmp = new Device()
    devicesList.push(deviceTmp)
  }
} catch (err) {
  console.log("🐛 Generate devicesList", err)
}

console.log("Print devicesList")
devicesList.forEach((element, i) => { console.log(i+1, element.getString()) })


