/**
 * @file:        /src/app/shared/attributes.ts
 * @description: The attributes class.
 * @version 2024-06-28 C2RLO  Add deviceId, modelId, connectionId as ObjectId | null
 * @version 2023-07-22 C2RLO  Set requirements for id, attributeDictionaryId and value
 * @version 2023-06-17 C2RLO  Add attributeDictionaryId
 * @version 2023-05-21 C2RLO  Init
 **/

import { ObjectId } from 'mongodb';

export class Attribute {
  _id: ObjectId
  deviceId: ObjectId | null
  modelId: ObjectId | null
  connectionId: ObjectId | null
  attributeDictionaryId: ObjectId
  value: string
}
