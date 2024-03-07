/**
 * @file:        /src/app/shared/attributes.ts
 * @description: The attributes class.
 * @version 2023-07-22 C2RLO  Set requirements for id, attributeDictionaryId and value
 * @version 2023-06-17 C2RLO  Add attributeDictionaryId
 * @version 2023-05-21 C2RLO  Init
 **/
import {v4 as uuidv4} from 'uuid'

export class Attribute {
  _id: string
  deviceId: string | null
  modelId: string | null
  connectionId: string | null
  attributeDictionaryId: string
  value: string

  constructor() {
    this._id = uuidv4()
  }
}
