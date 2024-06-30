/*
 * Description:  AttributeDictionary service, component
 *
 * 2023-06-01  C2RLO	  Add optional null
 * 2023-05-21  C2RLO    Init
 */
import { ObjectId } from 'mongodb'

export class AttributeDictionary {
  _id: ObjectId
  name?: string
  category?: string
  type?: string
  component?: string

  //TODO: problem with generate id during create object
  //TODO: unify all definition entity as class | interfance or
  generate() {
    this._id = new ObjectId()
  }
}
