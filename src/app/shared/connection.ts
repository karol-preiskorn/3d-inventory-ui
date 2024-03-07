/*
 * File:        /src/app/shared/connection.ts
 * Description: Represents a connection between two devices.
 *
 * 2023-05-21   C2RLO
 */

import {v4 as uuidv4} from 'uuid'

/**
 * @description Represents a connection between two devices.
 * @export
 * @class Connection
 */
export class Connection {
  _id: string
  name: string
  deviceIdTo: string
  deviceIdFrom: string

  /**
   * Generates a unique identifier for the connection.
   */
  generate() {
    this._id = uuidv4()
  }
}
