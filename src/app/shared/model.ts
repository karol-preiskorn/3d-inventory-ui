/**
 * @file: /src/app/shared/model.ts
 * @description: If any operation will be on dimensions? Class or interface.
 *               Model -< DeviceType, DeviceCategory
 * @version: 2023-04-30   C2RLO  Init
 */

import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator'
import {v4 as uuidv4} from 'uuid'

import {DeviceCategory} from './deviceCategories'
import {DeviceType} from './deviceTypes'

export class Dimension {
  private _width: number
  private _height: number
  private _depth: number

  constructor(width: number, height: number, depth: number) {
    this._width = width
    this._height = height
    this._depth = depth
  }

  get width(): number {
    return this._width
  }

  set width(value: number) {
    this._width = value
  }

  get height(): number {
    return this._height
  }

  set height(value: number) {
    this._height = value
  }

  get depth(): number {
    return this._depth
  }

  set depth(value: number) {
    this._depth = value
  }
}

export class Texture {
  constructor(front: string, back: string, side: string, top: string, bottom: string) {
    this.front = front
    this.back = back
    this.side = side
    this.top = top
    this.bottom = bottom
  }

  private _front: string
  private _back: string
  private _side: string
  private _top: string
  private _bottom: string

  get front(): string {
    return this._front
  }
  set front(value: string) {
    this._front = value
  }

  get back(): string {
    return this._back
  }
  set back(value: string) {
    this._back = value
  }

  get side(): string {
    return this._side
  }
  set side(value: string) {
    this._side = value
  }

  get top(): string {
    return this._top
  }
  set top(value: string) {
    this._top = value
  }

  get bottom(): string {
    return this._bottom
  }
  set bottom(value: string) {
    this._bottom = value
  }
}

export class Model {
  _id: string
  name: string
  dimension: Dimension
  texture: Texture
  type: DeviceType
  category: DeviceCategory

  constructor() {
    this._id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    })
    this.dimension = new Dimension(10, 20, 30)
    this.texture = new Texture('texture 1', 'texture 2', 'texture 3', 'texture 4', 'texture 5')
  }

  public print(): void {
    console.log(
      '[model] _id: ' +
        this._id +
        ', name: ' +
        this.name +
        ', dimensions: ' +
        this.getDimensionsString() +
        ', type: ' +
        this.type.name +
        ', category: ' +
        this.category.name
    )
  }

  public getString(): string {
    return (
      '[model] _id: ' + this._id + ', name: ' + this.name + ', dimensions: ' + this.getDimensionsString() + ', type: '
    )
  }

  public json(): string {
    return (
      '{ "_id": "' +
      this._id +
      '", "name": "' +
      this.name +
      '", "dimensions": ' +
      this.getDimensionsJson() +
      ', "type": ' + // this.type.json() +
      '}'
    )
  }

  public getDimensionsString(): string {
    return (
      '(width: ' +
      this.dimension?.width +
      ', height: ' +
      this.dimension?.height +
      ', depth: ' +
      this.dimension?.depth +
      ')'
    )
  }

  public getDimensionsJson(): string {
    return JSON.stringify(this.dimension, null, ' ')
  }

  public generate(): void {
    this._id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    })
    this.dimension = new Dimension(10, 20, 30)
    this.texture = new Texture('texture 1', 'texture 2', 'texture 3', 'texture 4', 'texture 5')
  }
}

const t = new Model()
t.generate()
t.print()
