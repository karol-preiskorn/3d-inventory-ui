/*
 * File:        /src/app/shared/floor.ts
 * Description: Definie floor 2d plan of servers rooms
 * Used by:
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-05-16   C2RLO
 */
import { v4 as uuidv4 } from 'uuid'
export class Floor {
  id: string
  name: string
  adress: string
  x: number
  y: number
  h: number

  constructor() {
    this.id = uuidv4()
  }
}
