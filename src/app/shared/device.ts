/**
 * @description: Main class operating on device. Structure data accessed via Oracle DB/Mongo
 * @version: 2023-02-18  C2RLO  Init
 **/
export interface Device {
  _id: string
  name: string
  modelId: string
  position: { x: number; y: number; h: number }
}

export interface DeviceCreate {
  _id?: string
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
