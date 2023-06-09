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
  device_id_to: string
  device_id_from: string

  constructor() {
    this.id = uuidv4()
  }
}
