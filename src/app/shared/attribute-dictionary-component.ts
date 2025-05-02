/*
 * Description:
 * 2023-06-03  C2RLO
 */

export interface Component {
  name: string
  description: string
}

export class ComponentDictionary {
  list: Component[] = [
    { name: '', description: '' },
    { name: 'Device', description: '' },
    { name: 'Model', description: '' },
    { name: 'Connection', description: '' },
    { name: 'Attribute', description: '' },
  ]

  get(): Component[] {
    return this.list
  }

  public getRandom(): Component {
    return this.list[Math.floor(Math.random() * this.list.length)]
  }

  public getRandomName(): string {
    return this.list[Math.floor(Math.random() * this.list.length)].name
  }

  findType(search: string): string | Component {
    const element = this.list.find((e) => e.name === search)
    return element || search // element?.DeviceType || search
  }

  findTypeByName(obj: string) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].name === obj) {
        console.log('-->', obj)
      }
    }
  }
}
