/**
 * @description Represents a connection between two devices.
 * @class Connection
 * @property {string} _id - The unique identifier of the connection.
 * @property {string} name - The name of the connection.
 * @property {string} deviceIdTo - The unique identifier of the device to connect to.
 * @property {string} deviceIdFrom - The unique identifier of the device to connect from.
 * @public
 */

export interface ConnectionInterface {
  _id: string
  name: string
  deviceIdTo: string
  deviceIdFrom: string
}

/**
 * Represents a connection between devices.
 */
export class Connection {
  _id: string
  name: string
  deviceIdTo: string
  deviceIdFrom: string

  constructor(connection?: ConnectionInterface) {
    this._id = connection?._id || ''
    this.name = connection?.name || ''
    this.deviceIdTo = connection?.deviceIdTo || ''
    this.deviceIdFrom = connection?.deviceIdFrom || ''
  }
}
