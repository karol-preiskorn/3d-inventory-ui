/**
 * @file: /src/app/device.ts
 * @description: Main class operating on device. Structure data accessed vi Oracle DB/Neo4j
 * @version: 2023-02-18  C2RLO  Init
 */
import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator'
import {v4 as uuidv4} from 'uuid'

interface Position {
  x: number
  y: number
  h: number
}

export class Device {
  _id: string
  name: string
  modelId: string
  position: Position

  print(): void {
    console.log(this.makeDeviceString())
  }

  makeDeviceString(): string {
    return (
      'name: ' + this.name + ', position: (' + this.position.x + ', ' + this.position.y + ', ' + this.position.h + ')'
    )
  }

  getString(): string {
    this.print()
    return this.makeDeviceString()
  }

  // TODO: move it to deviceList
  public _generate() {
    this._id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    }) // big_red_donkey
    // get list all models and select random id
    this.modelId = uuidv4()
  }
}
