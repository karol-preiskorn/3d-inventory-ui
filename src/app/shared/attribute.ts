/**
 * @description: The attributes class.
 * @class Attribute
 * @property {string} _id - The id of the attribute.
 * @property {string} deviceId - The id of the device.
 * @property {string} modelId - The id of the model.
 * @property {string} connectionId - The id of the connection.
 * @property {string} attributeDictionaryId - The id of the attribute dictionary.
 * @property {string} value - The value of the attribute.
 * @public
 * @export
 **/
/**
 * Description: The attributes class.
 */
export class Attribute {
  _id: string
  deviceId: string | null
  modelId: string | null
  connectionId: string | null
  attributeDictionaryId: string
  value: string

  constructor() {
    this._id = ''
    this.deviceId = null
    this.modelId = null
    this.connectionId = null
    this.attributeDictionaryId = ''
    this.value = ''
  }
}
