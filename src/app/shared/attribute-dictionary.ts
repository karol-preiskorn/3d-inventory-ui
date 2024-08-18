/*
 * Description:  AttributeDictionary service, component
 *
 */

/**
 * Represents an attribute dictionary.
 */
export class AttributeDictionary {
  _id: string

  constructor() {
    this._id = ''
    this.name = ''
    this.category = ''
    this.type = ''
    this.component = ''
  }

  name?: string
  category?: string
  type?: string
  component?: string
}
