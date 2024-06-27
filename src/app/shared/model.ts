/**
 * @file: /src/app/shared/model.ts
 * @description: If any operation will be on dimensions? Class or interface.
 *               Model -< DeviceType, DeviceCategory
 * @version: 2023-04-30   C2RLO  Init
 */

import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { v4 as uuidv4 } from 'uuid'

import { DeviceCategory } from './deviceCategories'
import { DeviceType } from './deviceTypes'

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

/**
 * Represents a model in the inventory.
 */
export class Model {
  private _id: string
  private _name: string
  private _dimension: Dimension
  private _texture: Texture
  private _type: DeviceType
  private _category: DeviceCategory

  constructor() {
    this._id = uuidv4()
    this._name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    })
    this._dimension = new Dimension(10, 20, 30)
    this._texture = new Texture('texture 1', 'texture 2', 'texture 3', 'texture 4', 'texture 5')
  }

  get id(): string {
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get dimension(): Dimension {
    return this._dimension
  }

  set dimension(value: Dimension) {
    this._dimension = value
  }

  get texture(): Texture {
    return this._texture
  }

  set texture(value: Texture) {
    this._texture = value
  }

  get type(): DeviceType {
    return this._type
  }

  set type(value: DeviceType) {
    this._type = value
  }

  get category(): DeviceCategory {
    return this._category
  }

  set category(value: DeviceCategory) {
    this._category = value
  }

  /**
   * Prints the model information to the console.
   */
  public print(): void {
    console.log('[model] _id: ' + this._id + ', name: ' + this._name + ', dimensions: ' + this.getDimensionsString())
  }

  /**
   * Returns a string representation of the model.
   * @returns A string representation of the model.
   */
  public getString(): string {
    return (
      '[model] _id: ' + this._id + ', name: ' + this._name + ', dimensions: ' + this.getDimensionsString() + ', type: '
    )
  }

  /**
   * Returns a JSON representation of the model.
   * @returns A JSON representation of the model.
   */
  public json(): string {
    return (
      '{ "_id": "' +
      this._id +
      '", "name": "' +
      this._name +
      '", "dimensions": ' +
      this.getDimensionsJson() +
      ', "type": ' + // this.type.json() +
      '}'
    )
  }

  /**
   * Returns a string representation of the model's dimensions.
   * @returns A string representation of the model's dimensions.
   */
  public getDimensionsString(): string {
    return (
      '(width: ' +
      this._dimension?.width +
      ', height: ' +
      this._dimension?.height +
      ', depth: ' +
      this._dimension?.depth +
      ')'
    )
  }

  /**
   * Returns a JSON representation of the model's dimensions.
   * @returns A JSON representation of the model's dimensions.
   */
  public getDimensionsJson(): string {
    return JSON.stringify(this._dimension, null, ' ')
  }

  /**
   * Generates a new model with random values.
   */
  public generate(): void {
    this._id = uuidv4()
    this._name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    })
    this._dimension = new Dimension(10, 20, 30)
    this._texture = new Texture('texture 1', 'texture 2', 'texture 3', 'texture 4', 'texture 5')
  }
}

const t = new Model()
t.generate()
t.print()
console.log(t.name)
