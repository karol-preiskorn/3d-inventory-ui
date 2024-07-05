/**
 * @description: Main class operating on device. Structure data accessed via Oracle DB/Mongo
 * @version: 2023-02-18  C2RLO  Init
 */

export class Position {
  x: number
  y: number
  h: number
}

export class Device {
  _id: string
  name: string
  modelId: string
  position: {
    x: number
    y: number
    h: number
  }

  toString(): string {
    return (
      'name: ' +
      this.name +
      '(' +
      this._id +
      '), position: (' +
      this.position.x +
      ', ' +
      this.position.y +
      ', ' +
      this.position.h +
      ')'
    )
  }

  constructor() {
    this._id = ''
    this.name = ''
    this.modelId = ''
    this.position = {
      x: 0,
      y: 0,
      h: 0,
    }
  }
}

let d = new Device()
d.toString()
