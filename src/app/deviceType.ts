/*
* File:        /src/app/devices copy.ts
* Description: Defines attribute Device Types
* Used by:
* Dependency:
* HISTORY:
* Date        By     Comments
* ----------  -----  ---------------------------------------------------------
* 2023-02-18  C2RLO
*/
/**
 * DeviceTypes
 *
 * @export DeviceTypes
 * @class DeviceTypes
 */
export class DeviceType {

  deviceType: string

  public getRandom(): string {
    return this.deviceTypes[Math.floor(Math.random() * this.deviceTypes.length)]
  }

  deviceTypes: string [] = [
  "Bridge",
  "CoolAir",
  "Copier",
  "Desktop",
  "Firewall",
  "Getaway",
  "Hubs",
  "Load Balancer",
  "Modem",
  "Multiplexer",
  "PDU System",
  "Power",
  "Printer",
  "Probe",
  "Repeaters",
  "Router",
  "Security Device",
  "Server",
  "Switch",
  "Telephone",
  "Terminal",
  "Traffic shaper",
  "Transceiver",
  "UPS System",
  "Workstations",
]

}