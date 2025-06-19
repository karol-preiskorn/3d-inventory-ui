/*
 * Description:
 * 2023-06-03  C2RLO
 */

export interface ComponentDictionaryItem {
  name: string
  description: string
}

export class ComponentDictionary {
  private readonly list: ComponentDictionaryItem[] = [
    { name: '', description: 'Empty component' },
    { name: 'device', description: 'A physical or virtual device in the inventory' },
    { name: 'model', description: 'A specific model or type of device' },
    { name: 'connection', description: 'A link or relationship between devices or components' },
    { name: 'attribute', description: 'A property or characteristic of a device or component' },
    { name: 'floor', description: 'A property or characteristic of a floor' },
  ]

  getAll(): ComponentDictionaryItem[] {
    return [...this.list]
  }

  getRandom(): ComponentDictionaryItem {
    const idx = Math.floor(Math.random() * this.list.length)
    return this.list[idx]
  }

  getRandomName(): string {
    return this.getRandom().name
  }

  findByName(name: string): ComponentDictionaryItem | undefined {
    return this.list.find((item) => item.name === name)
  }

  logIfExists(name: string): void {
    const item = this.findByName(name)
    if (item) {
      console.log('-->', name)
    }
  }
}
