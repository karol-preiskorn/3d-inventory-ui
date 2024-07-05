/**
 * @description: The attributes class.
 * @version 2024-06-28 C2RLO  Add deviceId, modelId, connectionId as ObjectId | null
 * @version 2023-07-22 C2RLO  Set requirements for id, attributeDictionaryId and value
 * @version 2023-06-17 C2RLO  Add attributeDictionaryId
 * @version 2023-05-21 C2RLO  Init
 **/

export class Attribute {
  _id: string
  deviceId: string | null
  modelId: string | null
  connectionId: string | null
  attributeDictionaryId: string
  value: string
}
