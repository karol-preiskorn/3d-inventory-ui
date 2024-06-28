/*
 * File:        /src/app/shared/connection.ts
 * Description: Represents a connection between two devices.
 *
 * 2023-05-21   C2RLO
 */

import { ObjectId } from 'mongodb';

/**
 * @description Represents a connection between two devices.
 * @export
 * @class Connection
 */
export class Connection {
  _id: ObjectId
  name: string
  deviceIdTo: ObjectId
  deviceIdFrom: ObjectId

  /**
   * Generates a unique identifier for the connection.
   */
  generate() {
    this._id = new ObjectId()
  }
}
