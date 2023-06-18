/*
 * File:        /src/app/shared/connection.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-05-21   C2RLO
 */
import { v4 as uuidv4 } from 'uuid'

export class Connection {
  id: string
  name: string
  deviceIdTo: string
  deviceIdFrom: string

  generate() {
    this.id = uuidv4()
  }
}
