/**
 * @description: If any operation will be on dimensions? Class or interface. Model -< DeviceType, DeviceCategory
 * @version: 2023-04-30   C2RLO  Init
 */

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
  _id: string
  name: string
  dimension: Dimension
  texture: Texture

  constructor() {
    this._id = ''
    this.name = ''
    this.dimension = {
      width: 0,
      height: 0,
      depth: 0,
    }
    this.texture = {
      front: '',
      back: '',
      side: '',
      top: '',
      bottom: '',
    }
  }
}
