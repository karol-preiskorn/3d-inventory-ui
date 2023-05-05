/*
 * File:        /src/app/shared/model.ts
 * Description:
 * Used by:
 * Dependency: If any operation will be on dimensions? Class or interfance.
 *
 * Model -< Device
 *
 * Date         By     Comments
 * ----------   -----  ------------------------------
 * 2023-04-30   C2RLO  Init
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

interface Dimension {
  width: number
  height: number
  depth: number
}

interface Texture {
  front: string
  back: string
  side: string
  top: string
  botom: string
}

export class Model {
  id: string
  name: string
  dimension: Dimension
  texture: Texture
  type: DeviceType
  category: DeviceCategory

  public print(): void {
    console.log(
      '[model] id: ' +
        this.id +
        ', name: ' +
        this.name +
        ', dimensions: ' +
        this.getDimensionsString() +
        ', type: ' +
        this.type +
        ', category: ' +
        this.category.name
    )
  }
  public getString(): string {
    return (
      '[model] id: ' +
      this.id +
      ', name: ' +
      this.name +
      ', dimensions: ' +
      this.getDimensionsString() +
      ', type: ' +
      this.type +
      ', category: ' +
      this.category.name
    )
  }
  public getDimensionsString(): string {
    return (
      '(width: ' +
      this.dimension?.width +
      ', height: ' +
      this.dimension?.height +
      ', deep: ' +
      this.dimension?.depth +
      ')'
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
