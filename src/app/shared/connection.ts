/**
 * @description: Represents a connection between two devices.
 * @version: 2023-05-21   C2RLO
 */

export interface Connection {
  _id: string
  name: string
  deviceIdTo: string
  deviceIdFrom: string
}

export class Connection {
  _id: string
  name: string
  deviceIdTo: string
  deviceIdFrom: string
}
