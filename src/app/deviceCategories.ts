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

export default interface DeviceCategoryTypes {
  Category: string;
  Description: string;
}

export class DeviceCategory {
  deviceCategories: DeviceCategoryTypes[] = [
    {
      Category: "Connectivity",
      Description:
        "Data centers often have multiple fiber connections to the internet provided by multiple carriers.",
    },
    {
      Category: "Facility",
      Description:
        "Data center buildings may be specifically designed as a data center. For example, the height of ceilings will match requirements for racks and overhead systems. In some cases, a data center occupies a floor of an existing building.",
    },
    {
      Category: "Site",
      Description:
        'A data center requires a site with connections to grids, networks and physical <a href="https://simplicable.com/new/infrastructure">infrastructure</a>  such as roads. Proximity to markets, customers, employees and services also play a role in selecting an appropriate site. Locating data centers in cold climates can reduce cooling costs.',
    },
  ]

  public getRandom(): DeviceCategoryTypes {
    return this.deviceCategories[Math.floor(Math.random() * this.deviceCategories.length)]
  }

}