/*
* File:        /src/app/DeviceTypes.ts
* Description: Defines attribute Device Type list
* @memberof DeviceTypes
* Dependency:
*
* Date        By     Comments
* ----------  -----  ------------------------
* 2023-02-19	C2RLO	 add findType
* 2023-02-18  C2RLO  Init
*/

/**
 * DeviceTypes
 * --
 * @export DeviceTypes
 * @class DeviceTypes
 */

type deviceTypeType = {
  DeviceType: string
}

export class DeviceTypes {

  deviceTypeList = [
    { DeviceType: "Bridge" },
    { DeviceType: "CoolAir" },
    { DeviceType: "Copier" },
    { DeviceType: "Desktop" },
    { DeviceType: "Firewall" },
    { DeviceType: "Getaway" },
    { DeviceType: "Hubs" },
    { DeviceType: "Load Balancer" },
    { DeviceType: "Modem" },
    { DeviceType: "Multiplexer" },
    { DeviceType: "PDU System" },
    { DeviceType: "Power" },
    { DeviceType: "Printer" },
    { DeviceType: "Probe" },
    { DeviceType: "Repeaters" },
    { DeviceType: "Router" },
    { DeviceType: "Security Device" },
    { DeviceType: "Server" },
    { DeviceType: "Switch" },
    { DeviceType: "Telephone" },
    { DeviceType: "Terminal" },
    { DeviceType: "Traffic shaper" },
    { DeviceType: "Transceiver" },
    { DeviceType: "UPS System" },
    { DeviceType: "Workstations" }
  ]
  /**
   * Return random type from deviceTypeList
   * @return {*}  {string}
   * @memberof DeviceTypes
   */
  getRandom(): string {
    return this.deviceTypeList[Math.floor(Math.random() * this.deviceTypeList.length)].DeviceType
  }
  /**
   *
   *
   * @param {string} search
   * @return {*}  {string}
   * @memberof DeviceTypes
   */
  findType(search: string): string | undefined {
    const element = this.deviceTypeList.find((e) => e.DeviceType === search)
    return element?.DeviceType || search // element?.DeviceType || search
  }

  findObj(
    obj: deviceTypeType
  ) {
    for (let i = 0; i < this.deviceTypeList.length; i++) {
      if (this.deviceTypeList[i].DeviceType === obj.DeviceType) {
        console.log('-->', obj)
      }
    }
  }
}

var devicesT = new DeviceTypes()
var f = devicesT.findType('Probe')
console.log('-->', f)

// Function loop over the array,
// then check if the type property is equal to the property in each object of the array

function findObj(
  arr: Array<deviceTypeType>,
  obj: deviceTypeType
) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].DeviceType === obj.DeviceType) {
      console.log('-->', obj)
    }
  }
}

findObj(devicesT.deviceTypeList, { DeviceType: "Workstations" })
