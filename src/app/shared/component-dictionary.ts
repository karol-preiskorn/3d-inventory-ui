/*
 * File:        /src/app/shared/component-dictionary.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date        By       Comments
 * ----------  -------  ------------------------------
 * 2023-06-03  C2RLO
 */

export interface ComponentDictionaryItem {
  name: string
  description: string
}
export class ComponentDictionary {
  list: ComponentDictionaryItem[] = [
    { name: '-', description: '' },
    { name: 'device', description: '' },
    { name: 'model', description: '' },
    { name: 'connection', description: '' },
    { name: 'attribute', description: '' },
  ]
  get(): ComponentDictionaryItem[] {
    return this.list
  }
  public getRandom(): ComponentDictionaryItem {
    return this.list[Math.floor(Math.random() * this.list.length)]
  }
  public getRandomName(): string {
    return this.list[Math.floor(Math.random() * this.list.length)].name
  }
  findType(search: string): string | ComponentDictionaryItem {
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