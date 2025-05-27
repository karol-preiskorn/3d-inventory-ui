/*
 * Description:
 * 2023-06-03  C2RLO
 */

export interface ComponentDictionaryItem {
  name: string;
  description: string;
}

export class ComponentDictionary {
  private readonly list: ComponentDictionaryItem[] = [
    { name: '', description: '' },
    { name: 'device', description: '' },
    { name: 'model', description: '' },
    { name: 'connection', description: '' },
    { name: 'attribute', description: '' },
  ];

  getAll(): ComponentDictionaryItem[] {
    return [...this.list];
  }

  getRandom(): ComponentDictionaryItem {
    const idx = Math.floor(Math.random() * this.list.length);
    return this.list[idx];
  }

  getRandomName(): string {
    return this.getRandom().name;
  }

  findByName(name: string): ComponentDictionaryItem | undefined {
    return this.list.find(item => item.name === name);
  }

  logIfExists(name: string): void {
    const item = this.findByName(name);
    if (item) {
      console.log('-->', name);
    }
  }
}
