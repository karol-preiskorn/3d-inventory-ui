/**
 * Represents an attribute dictionary.
 */
export class AttributeDictionary {

  _id!: string
  component?: string
  type?: string
  name?: string
  units?: string

  constructor() {
    this._id = ''
    this.component = ''
    this.type = ''
    this.name = ''
    this.units = ''
  }
}
