/*
 * File:        /src/app/shared/floor.ts
 * Description: Define floor 2d plan of servers rooms
 * Used by:
 * Dependency:
 *
 * Date        By     Comments
 * ----------  -----  ------------------------------
 * 2023-07-25  C2RLO  Convert class to interfance
 * 2023-05-16  C2RLO  Init
 */


export interface FloorDimension {
  description: string
  x: string
  y: string
  h: string
  xPos: string
  yPos: string
  hPos: string
}

export interface Floor {
  id: string
  name: string
  address: {
    street: string
    city: string,
    country: string
    postcode: string
  }
  dimension: [FloorDimension]
}
