/*
 * File:        /src/app/shared/device copy.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Model -< Device
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-04-30   C2RLO
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

interface Dimensions {
  w: number
  h: number
  d: number
}

export class Model {
  id: string
  name?: string | null
  dimensions: Dimensions | null
  bitmaps: {
    front: string
    back: string
    side: string
    top: string
    botom: string
  }
  type: DeviceType
  category: DeviceCategory

  public print(): void {
    console.log(
      '-->[device model] id: ' +
        this.id +
        ', name: ' +
        this.name +
        ', dimensions: ' +
        this.dimensions +
        ', type: ' +
        this.type +
        ', category: ' +
        this.category.name
    )
  }

  public getString(): string {
    return (
      '-->[device model] id: ' +
      this.id +
      ', name: ' +
      this.name +
      ', dimensions: ' +
      this.dimensions +
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
    }) // big-red-donkey

    this.type = new DeviceTypeDict().getRandom()
    this.category = new DeviceCategoryDict().getRandom()
  }
}
