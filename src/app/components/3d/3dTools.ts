/**
 * Utility class for 3D tools.
 */

import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { Device } from '../../shared/device'
import { Model } from '../../shared/model'

export class Tools3D {
  private racks: Array<Device> = []
  private deviceList: Device[] = []
  private modelList: Model[] = []

  constructor(modelList: Model[] = []) {
    this.modelList = modelList
  }

  private getRandomX(): number {
    return Math.random() * 100 - 50
  }

  private getRandomY(): number {
    return Math.random() * 100 - 50
  }

  private getRandomH(): number {
    return Math.floor(Math.random() * 10) + 1
  }

  private checkDistanceInDeviceList(): { x: number; y: number } {
    let x = this.getRandomX()
    let y = this.getRandomY()
    let isTooClose = true
    let counter = 0
    const maxAttempts = 100

    while (isTooClose && counter < maxAttempts) {
      isTooClose = false
      for (const element of this.racks) {
        const distance = Math.sqrt(
          Math.pow(Math.abs(x - element.position.x), 2) + Math.pow(Math.abs(y - element.position.y), 2)
        )
        if (distance < 8) {
          isTooClose = true
          break
        }
      }

      if (isTooClose) {
        x = this.getRandomX()
        y = this.getRandomY()
      }
      counter++
    }

    return { x, y }
  }

  private generateRandomDeviceRack(x: number, y: number): Device {
    if (this.modelList.length === 0) {
      throw new Error('Model list is empty. Cannot generate device rack.')
    }

    return {
      _id: uuidv4(),
      name: faker.company.name() + ' - ' + faker.company.buzzPhrase(),
      position: {
        x: x,
        y: y,
        h: this.getRandomH(),
      },
      modelId: this.modelList[Math.floor(Math.random() * this.modelList.length)]._id,
    }
  }

  public generateRacksList(count: number): Device[] {
    this.racks = []
    for (let i = 0; i < count; i++) {
      const position = this.checkDistanceInDeviceList()
      this.racks.push(this.generateRandomDeviceRack(position.x, position.y))
    }
    return this.racks
  }

  public getRacks(): Device[] {
    return this.racks
  }

  // createRacksList3d(): void {
  //   this.racks.forEach((element) => {
  //     this.createRack3d(element.position.x, element.position.y, Math.round(Math.random() * 10))
  //   })
  // }

  // createRack3d(floor_x: number, floor_y: number, h: number): void {
  //   for (let i = 0; i < h; i++) {
  //     this.createDevice3d(3, 1, 3, floor_x, i + 0.5, floor_y)
  //   }
  // }
}
