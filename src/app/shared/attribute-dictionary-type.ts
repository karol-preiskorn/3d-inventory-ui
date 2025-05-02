/*
 * Description: `Type` interface and `TypeDictionary` class
 */

export interface Type {
  name: string
  description: string
}

export class TypeDictionary {
  list: Type[] = [
    { name: '', description: '' },
    { name: 'String', description: '' },
    { name: 'Number', description: '' },
    { name: 'Object', description: '' },
  ]

  get(): Type[] {
    return this.list
  }

  public getRandom(): Type {
    return this.list[Math.floor(Math.random() * this.list.length)]
  }

  public getRandomName(): string {
    return this.list[Math.floor(Math.random() * this.list.length)].name
  }

  find(search: string): string | Type {
    const element = this.list.find((e) => e.name === search)
    return element || search // element?.DeviceType || search
  }

  findByName(obj: string) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].name === obj) {
        console.log('-->', obj)
      }
    }
  }
}
