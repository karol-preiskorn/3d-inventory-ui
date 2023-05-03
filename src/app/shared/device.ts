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
  name?: string | null
  position?: Position | null
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

  public generate(): void {
    this.id = uuidv4()
    this.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      style: 'lowerCase',
      separator: '-',
    }) // big_red_donkey
  }
}
