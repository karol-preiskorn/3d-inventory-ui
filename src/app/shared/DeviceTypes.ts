/**
 * @description: Defines attribute Device Type list for attribute

 */

export interface DeviceTypeInterface {
  name: string
  description: string
}

export class DeviceType implements DeviceTypeInterface {
  constructor(
    public name: string,
    public description: string = '',
  ) {}
}

export class DeviceTypeDict {
  private list: DeviceType[] = [
    new DeviceType(''),
    new DeviceType('Bridge'),
    new DeviceType('CoolAir'),
    new DeviceType('Copier'),
    new DeviceType('Desktop'),
    new DeviceType('Firewall'),
    new DeviceType('Gateway'),
    new DeviceType('Hubs'),
    new DeviceType('Load Balancer'),
    new DeviceType('Modem'),
    new DeviceType('Multiplexer'),
    new DeviceType('PDU System'),
    new DeviceType('Power'),
    new DeviceType('Printer'),
    new DeviceType('Probe'),
    new DeviceType('Repeaters'),
    new DeviceType('Router'),
    new DeviceType('Security Device'),
    new DeviceType('Server'),
    new DeviceType('Switch'),
    new DeviceType('Telephone'),
    new DeviceType('Terminal'),
    new DeviceType('Traffic shaper'),
    new DeviceType('Transceiver'),
    new DeviceType('UPS System'),
    new DeviceType('Workstations'),
  ]

  public get(): DeviceType[] {
    return [...this.list]
  }

  public getRandom(): DeviceType {
    return this.list[Math.floor(Math.random() * this.list.length)]
  }

  public getRandomName(): string {
    return this.getRandom().name
  }

  public findType(name: string): DeviceType | string {
    return this.list.find((e) => e.name === name) ?? name
  }

  /**
   * Logs the device type if found by name.
   * @param name - The name to search for.
   */
  public logTypeByName(name: string): void {
    const found = this.list.find((e) => e.name === name)
    if (found) {
      // Device type found - could be logged to a service in production
    }
  }
}
