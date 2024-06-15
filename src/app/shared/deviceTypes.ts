/**
 * @description: Defines attribute Device Type list
 * @memberof    DeviceTypes
 *
 * @version: 2023-08-03  C2RLO  Add docs
 * @version: 2023-04-11	 C2RLO	convert to DeviceType and DeviceTypeList
 * @version: 2023-02-19	 C2RLO	add findType
 * @version: 2023-02-18  C2RLO  Init
 */

export interface DeviceTypeInterface {
  name: string
  description: string
}

export type DeviceTypeListType = DeviceTypeInterface

export class DeviceType {
  name: string
  description: string

  constructor(deviceType: DeviceTypeListType) {
    this.name = deviceType.name
    this.description = deviceType.description
  }
}

export class DeviceTypeDict {
  private list: DeviceType[] = [
    {name: '', description: ''},
    {name: 'Bridge', description: ''},
    {name: 'CoolAir', description: ''},
    {name: 'Copier', description: ''},
    {name: 'Desktop', description: ''},
    {name: 'Firewall', description: ''},
    {name: 'Gateway', description: ''},
    {name: 'Hubs', description: ''},
    {name: 'Load Balancer', description: ''},
    {name: 'Modem', description: ''},
    {name: 'Multiplexer', description: ''},
    {name: 'PDU System', description: ''},
    {name: 'Power', description: ''},
    {name: 'Printer', description: ''},
    {name: 'Probe', description: ''},
    {name: 'Repeaters', description: ''},
    {name: 'Router', description: ''},
    {name: 'Security Device', description: ''},
    {name: 'Server', description: ''},
    {name: 'Switch', description: ''},
    {name: 'Telephone', description: ''},
    {name: 'Terminal', description: ''},
    {name: 'Traffic shaper', description: ''},
    {name: 'Transceiver', description: ''},
    {name: 'UPS System', description: ''},
    {name: 'Workstations', description: ''},
  ]

  get(): DeviceType[] {
    return this.list
  }

  public getRandom(): DeviceType {
    return this.list[Math.floor(Math.random() * this.list.length)]
  }

  public getRandomName(): string {
    return this.list[Math.floor(Math.random() * this.list.length)].name
  }

  findType(search: string): DeviceType | string {
    const element = this.list.find((e) => e.name === search)
    return element || search
  }

  findTypeByName(obj: string): void {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].name === obj) {
        console.log('-->', obj)
      }
    }
  }
}
