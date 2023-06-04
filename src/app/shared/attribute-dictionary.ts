/*
 * File:        /src/app/shared/attribute_dictionary.ts
 * Description:
 * Used by:     AttributeDictionary service, component
 * Dependency:  -
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-05-21   C2RLO     Init
 */
import { v4 as uuidv4 } from 'uuid'

export class AttributeDictionary {
  id: string
  name: string
  category: string
  type: string
  component: string

  constructor() {
    this.id = uuidv4()
  }
}
