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
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { v4 as uuidv4 } from 'uuid'
import { DeviceCategory, DeviceCategoryDict } from './deviceCategories'
import { DeviceType, DeviceTypeDict } from './deviceTypes'

export class Device {
  id: string
  name?: string | null
  type: DeviceType
  category: DeviceCategory

  public print(): void {
    console.log(
      '-->[device] id: ' +
        this.id +
        ', name: ' +
        this.name +
        ', type: ' +
        this.type +
        ', category: ' +
        this.category.name
    )
  }

  public getString(): string {
    return (
      '-->[device] id: ' +
      this.id +
      ', name: ' +
      this.name +
      ', type: ' +
      this.type +
      ', category: ' +
      this.category.name
    )
  }

  public generate(): void {
    this.id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    }) // big_red_donkey

    this.type = new DeviceTypeDict().getRandom()
    this.category = new DeviceCategoryDict().getRandom()
  }
}
