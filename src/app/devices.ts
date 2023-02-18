/*
* File:        /src/app/devices.ts
* Description: Main class operating on devices. Structure data accessed vi Oracle DB/Neo4j
* Used by:
* Dependency:
* HISTORY:
* Date        By     Comments
* ----------  -----  ---------------------------------------------------------
* 2023-02-18  C2RLO  Init
*/
import { v4 as uuidv4 } from 'uuid'
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator"
// import * as Chance from 'chance';
import { DeviceCategory } from './deviceCategories'
import { DeviceType } from './deviceType'
import DeviceCategoryTypes from './deviceCategories'


export class device {

  id: string
  name: string
  type: string
  category: DeviceCategoryTypes

  constructor() {
    this.id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-'
    }) // big_red_donkey
    this.type = new DeviceType().getRandom()
    this.category = new DeviceCategory().getRandom()
  }

  print() {
    console.log("[device]", this.id, this.name, this.type, this.category.Category);
  }
}

// @TODO: #1 Generate 100 random records

export var devicesList: device[] = []

try {
  if (device.length == 0) {
    var deviceTmp = new device()
    devicesList.push(deviceTmp)
  }
} catch (err) {
  console.log("🐛 Reject(Error) in sqlExecute:", err)
}

devicesList.forEach(element => { element.print() });
