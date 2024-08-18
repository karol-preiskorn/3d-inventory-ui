/**
 * @remarks
 * This class is used to store information about a device, including its ID, name, model ID, and position.
 * @description
 * class operating on device. Structure data accessed via Oracle DB/Mongo
 * @public
 * @export
 * @class Device
 * @implements {DeviceInterface}
 * @implements {DeviceCreate}
 * @implements {Position}
 **/

export interface Position {
  x: number
  y: number
  h: number
}

export interface DeviceInterface {
  _id: string
  name: string
  modelId: string
  position: Position
}

export class Device {
  _id!: string
  name: string = ''
  modelId: string = ''
  position: Position = { x: 0, y: 0, h: 0 }

  constructor(name?: string, modelId?: string, position?: Position) {
    if (name && modelId && position) {
      this.name = name
      this.modelId = modelId
      this.position = position
    }
  }

  toString(): string {
    return `Device ID: ${this._id}, Name: ${this.name}`
  }
}

// @TODO: #2:30min Continue implementing the tests for the Device class. Add tests for the constructor and the toString method. Make sure to test the case where the constructor is called with no arguments. Add object data to the constructor and test the toString method.
const debug = true
if (debug === true) {
  const d1 = new Device()
  console.log(d1.toString())

  const d2Data = { name: 'Device 1', modelId: '1', position: { x: 1, y: 2, h: 3 } }
  const d2 = new Device(d2Data.name, d2Data.modelId, d2Data.position)

  d1.toString()
  d2.toString()
}
