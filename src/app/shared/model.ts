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
  deep: number
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
  name?: string | null
  dimensions: Dimension | null
  texture?: Texture | null
  type: DeviceType
  category: DeviceCategory

  public print(): void {
    console.log(
      '[model] id: ' +
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
      '[model] id: ' +
      this.id +
      ', name: ' +
      this.name +
      ', dimensions: (' +
      this.dimensions?.width +
      'x' +
      this.dimensions?.height +
      'x' +
      this.dimensions?.deep +
      '), type: ' +
      this.type +
      ', category: ' +
      this.category.name
    )
  }
  public getDimentionsString(): string {
    return (
      this.dimensions?.width +
      'x' +
      this.dimensions?.height +
      'x' +
      this.dimensions?.deep +
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
