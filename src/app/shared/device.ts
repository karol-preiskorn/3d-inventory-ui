/*
 * File:        /src/app/device.ts
 * Description: Main class operating on device. Structure data accessed vi Oracle DB/Neo4j
 * Used by:
 * Dependency:
 *
 * Date        By     Comments
 * ----------  -----  ---------------------------------------------------------
 * 2023-02-18  C2RLO  Init
 */
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { v4 as uuidv4 } from 'uuid'

interface Position {
  x: number
  y: number
  h: number
}

export class Device {
  id: string
  name: string
  modelId: string
  position: Position
  public print(): void {
    console.log(
      '-->[device] id: ' +
        this.id +
        ', name: ' +
        this.name +
        ', position: ' +
        this.position
    )
  }

  public getString(): string {
    return (
      '-->[device] id: ' +
      this.id +
      ', name: ' +
      this.name +
      ', position: ' +
      this.position
    )
  }

  // TODO: move it to deviceList
  public constructor() {
    this.id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    }) // big_red_donkey
    // get list all models and select random id
    this.modelId = uuidv4()
  }
}
