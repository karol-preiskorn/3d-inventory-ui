/*
 * Description: Define DeviceCategoryTypes and access to this dictionary
 * 2023-02-18  C2RLO
 */

export class DeviceCategory {
  name: string = ''
  description: string = ''
}

export class DeviceCategoryDict {
  list: DeviceCategory[] = [
    {
      name: '',
      description: '',
    },
    {
      name: 'Connectivity',
      description: 'Data centers often have multiple fiber connections to the internet provided by multiple carriers.',
    },
    {
      name: 'Facility',
      description:
        'Data center buildings may be specifically designed as a data center. For example, the height of ceilings will match requirements for racks and overhead systems. In some cases, a data center occupies a floor of an existing building.',
    },
    {
      name: 'Site',
      description:
        'A data center requires a site with connections to grids, networks and physical <a href="https://simplicable.com/new/infrastructure">infrastructure</a>  such as roads. Proximity to markets, customers, employees and services also play a role in selecting an appropriate site. Locating data centers in cold climates can reduce cooling costs.',
    },
  ]

  public getRandomCategory(): string {
    return this.list[Math.floor(Math.random() * this.list.length)].name
  }

  findCategory(deviceCategory: DeviceCategory, searchCategory: string) {
    return deviceCategory.name == searchCategory
  }

  public getRandom(): DeviceCategory {
    return this.list[Math.floor(Math.random() * this.list.length)]
  }

  public getRandomName(): string {
    return this.list[Math.floor(Math.random() * this.list.length)].name
  }
}
