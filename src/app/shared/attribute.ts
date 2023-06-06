/*
 * File:        /src/app/shared/attributes.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-05-21   C2RLO
 */
import { v4 as uuidv4 } from 'uuid'

export class Attribute {
  id: string
  deviceId: string
  modelId: string
  connectionId: string
  value: string

  constructor() {
    this.id = uuidv4()
  }
}
