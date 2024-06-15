/*
 * File:        /src/app/shared/attribute_dictionary.ts
 * Description:
 * Used by:     AttributeDictionary service, component
 * Dependency:  -
 *
 * Date         By        Comments
 * ----------  -------  ------------------------------
 * 2023-06-01  C2RLO	  Add optional null
 * 2023-05-21  C2RLO    Init
 */
import { v4 as uuidv4 } from 'uuid'

export class AttributeDictionary {
  _id: string
  name?: string
  category?: string
  type?: string
  component?: string

  //TODO: problem with generate id during create object
  //TODO: unify all definition entity as class | interfance or
  generate() {
    this._id = uuidv4()
  }
}
