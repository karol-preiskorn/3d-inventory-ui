/**
 * @file: /src/app/shared/model.ts
 * @description: If any operation will be on dimensions? Class or interface.
 *               Model -< DeviceType, DeviceCategory
 * @version: 2023-04-30   C2RLO  Init
 */

import { ObjectId } from 'mongodb';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

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
  bottom: string
}

export class Model {
  _id: ObjectId
  name: string
  dimension: Dimension
  texture: Texture

  public print(): void {
    console.log('[model] _id: ' + this._id + ', name: ' + this.name + ', dimensions: ' + this.getDimensionsString())
  }
  public getString(): string {
    return '[model] _id: ' + this._id + ', name: ' + this.name + ', dimensions: ' + this.getDimensionsString()
  }
  public json(): string {
    return '{ "_id": "' + this._id + '", "name": "' + this.name + '", "dimensions": {' + this.getDimensionsString()
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
  public getDimensionsJson(): string {
    return JSON.stringify(this.dimension, null, ' ')
  }

  public generate(): void {
    this._id = new ObjectId()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    }) // big-red-donkey
    this.dimension.depth = Math.floor(Math.random() * 100) + 1
    this.dimension.height = Math.floor(Math.random() * 100) + 1
    this.dimension.width = Math.floor(Math.random() * 100) + 1
    this.texture.back = ''
    this.texture.bottom = ''
    this.texture.front = ''
    this.texture.side = ''
    this.texture.top = ''
  }
}

const t = new Model()
t.generate()
t.print()
