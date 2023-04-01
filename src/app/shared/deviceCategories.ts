/*
 * File:        /src/app/deviceCategories.ts
 * Description: Define DeviceCategoryTypes and access to this dictionary
 * Used by:
 * Dependency:
 *
 * Date        By     Comments
 * ----------  -----  ---------------------------------------------------------
 * 2023-02-18  C2RLO
 */

export interface DeviceCategoriesInterfance {
  Category: string
  Description: string
}

export class DeviceCategories {
  deviceCategories: DeviceCategoriesInterfance[] = [
    {
      Category: 'Connectivity',
      Description:
        'Data centers often have multiple fiber connections to the internet provided by multiple carriers.',
    },
    {
      Category: 'Facility',
      Description:
        'Data center buildings may be specifically designed as a data center. For example, the height of ceilings will match requirements for racks and overhead systems. In some cases, a data center occupies a floor of an existing building.',
    },
    {
      Category: 'Site',
      Description:
        'A data center requires a site with connections to grids, networks and physical <a href="https://simplicable.com/new/infrastructure">infrastructure</a>  such as roads. Proximity to markets, customers, employees and services also play a role in selecting an appropriate site. Locating data centers in cold climates can reduce cooling costs.',
    },
  ]

  public getRandomCategory(): string {
    return this.deviceCategories[
      Math.floor(Math.random() * this.deviceCategories.length)
    ].Category
  }

  findCategory(
    deviceCategory: DeviceCategoriesInterfance,
    searchCategory: string
  ) {
    return deviceCategory.Category == searchCategory
  }

  findCategoryImplementation(
    this: any,
    searchCategory: string
  ): DeviceCategoriesInterfance[] {
    return this.deviceCategories.find(this.findCategory(searchCategory))
  }

  // getCat(category: string): string {
  //   return this.deviceCategories.find((element) => element.Category === category)?.Category
  // }

  public getRandom(): DeviceCategoriesInterfance {
    return this.deviceCategories[
      Math.floor(Math.random() * this.deviceCategories.length)
    ]
  }
}

// var devicesT = new DeviceCategory()
// var r = devicesT.findCategoryImplementation('Site')
