/*
* File:        /src/app/devices.ts
* Description: Data app list all devices. Structure data accessed vi Oracle DB/Neo4j
* Used by:
* Dependency:
* HISTORY:
* Date        By     Comments
* ----------  -----  ---------------------------------------------------------
* 2023-02-18  C2RLO
*/

export interface Device {
  id: number;
  name: string;
  type: string;
  category: string;
}


// @TODO: #1 Generate 100 random records
try {
  let deviceContext = Object.assign({}, Device)

  if (Device.length == 0) {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }) // big_red_donkey
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
      length: 2,
    }) // big-donkey
    var randomDeviceTypes =
      DeviceTypes[Math.floor(Math.random() * DeviceTypes.length)]
    var randomDeviceCategory =
      DeviceCategory[Math.floor(Math.random() * DeviceCategory.length)]
  }
} catch (err) {
  console.log("🐛 Reject(Error) in sqlExecute:", err)
}

export const devices = [
  {
    id: 1,
    name: 'Phone XL',
    type: 'Telephone',
    category: 'Mobile'
  },
  {
    id: 2,
    name: 'Phone Mini',
    type: 'Telephone',
    category: 'Mobile'
  },
  {
    id: 3,
    name: 'DELL',
    type: 'RACK',
    category: 'Server'
  }
];
