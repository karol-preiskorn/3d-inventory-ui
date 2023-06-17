/*
 * File:        /src/app/shared/attributes.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date       By        Comments
 * ---------- ------- ------------------------------
 * 2023-06-17	C2RLO   Add attributeDictionaryId
 * 2023-05-21 C2RLO   Init
 */
import { v4 as uuidv4 } from 'uuid'

export class Attribute {
  id: string | null
  deviceId: string | null
  modelId: string | null
  connectionId: string | null
  attributeDictionaryId: string | null
  value: string | null

  constructor() {
    this.id = uuidv4()
  }
}
