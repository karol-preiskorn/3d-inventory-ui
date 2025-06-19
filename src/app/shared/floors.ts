﻿/**
 * @file:         /src/app/shared/floor.ts
 * @description:  Define floor 2d plan of servers rooms
 * @version:      2023-07-25  C2RLO  Convert class to interface
 * @version:      2023-05-16  C2RLO  Init
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

export interface Floors {
  _id: string
  name: string
  address: {
    street: string
    city: string
    country: string
    postcode: string
  }
  dimension: [FloorDimension]
}


