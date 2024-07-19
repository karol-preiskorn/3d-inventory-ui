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
}

// tests
// let d1Data = { _id: '1', name: 'Device 1', modelId: '1', position: { x: 1, y: 2, h: 3 } }
// let d1 = new Device(d1Data)

// let d = new Device()
// d.toString()
