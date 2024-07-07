/**
 * @description: Main class operating on device. Structure data accessed via Oracle DB/Mongo
 * @version: 2023-02-18  C2RLO  Init

Here is an example of creating objects directly, which will give you live error checking. The problem with JSON.parse it that the compiler will not check at compile time what it returns. If you work with unknown live data you will have to write some error check manually.

interface Obj {
  str: string
  num: number
}

class C {
  constructor(o:Obj) {

  }
}

var o = {test:43, str:"abc"}
var p = {num:43, str:"abc"}

var instanceOne = new C(o) // not allowed
var instanceTwo = new C(p) // allowed

 */

export interface Device {
  _id: string
  name: string
  modelId: string
  position: { x: number; y: number; h: number }
}

export class Device {
  _id: string
  name: string
  modelId: string
  position: { x: number; y: number; h: number }

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

  static getRandomX(): number {
    return Math.round(Math.random() * 40 - 20)
  }

  static getRandomY(): number {
    return Math.round(Math.random() * 40 - 20)
  }

  static getRandomH(): number {
    return Math.round(Math.random() * 10)
  }

  constructor(o?: Device) {
    if (o !== undefined) {
      // handle the case when an object is passed as an argument
      this._id = o._id
      this.name = o.name
      this.modelId = o.modelId
      this.position = o.position
    } else {
      // handle the case when no argument is passed
      this._id = '1'
      this.name = 'Device 1'
      this.modelId = '1'
      this.position = {
        x: Device.getRandomX(),
        y: Device.getRandomY(),
        h: Device.getRandomH(),
      }
    }
  }
}

// tests
let d1Data = { _id: '1', name: 'Device 1', modelId: '1', position: { x: 1, y: 2, h: 3 } }
let d1 = new Device(d1Data)

let d = new Device()
d.toString()
