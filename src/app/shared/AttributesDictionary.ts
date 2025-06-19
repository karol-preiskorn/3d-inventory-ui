/**
 * Represents an attribute dictionary.
 */
export class AttributesDictionary {
  _id: string = ''
  name: string = ''
  type: 'string' | 'number' | 'boolean' = 'string' // Type of the attribute
  unit: '' | 'm' | 'cm' | 'mm' | 'km' | 'g' | 'kg' | 'mg' | 'l' | 'ml' | 's' | 'min' | 'h' = ''
  componentName: 'device' | 'model' | 'connection' | 'attribute' = 'device'

  constructor(init?: Partial<AttributesDictionary>) {
    Object.assign(this, init)
  }
}
