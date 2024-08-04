/**
 * Utility class for 3D tools.
 */

import { v4 as uuidv4 } from 'uuid'

import { faker } from '@faker-js/faker'

import { Device } from '../../shared/device'
import { Model } from '../../shared/model'

class Tools3D {
  private racks: Array<Device> = []
  private deviceList: Device[] = []
  private modelList: Model[] = []

  getRandomX = () => Math.round(Math.random() * 40 - 20)
  getRandomY = () => Math.round(Math.random() * 40 - 20)
  getRandomH = () => Math.round(Math.random() * 10)

  checkDistanceInDeviceList() {
    let x = this.getRandomX()
    let y = this.getRandomY()
    let distance = true
    let counter = 0
    while (distance == true && counter < 10) {
      this.racks.forEach((element) => {
        // console.log('Generate rack (' + x + ', ' + y + ') ' + Math.sqrt(Math.pow(Math.abs(x - element.x), 2) + Math.pow(Math.abs(y - element.y), 2)))
        if (
          Math.sqrt(Math.pow(Math.abs(x - element.position.x), 2) + Math.pow(Math.abs(y - element.position.y), 2)) < 8
        ) {
          distance = false
        }
        counter = counter + 1
      })
      if (distance == (false as boolean)) {
        x = this.getRandomX()
        y = this.getRandomY()
        // distance = true
      }
      counter = counter + 1
    }
  }

  generateRandomDeviceRack(): Device {
    return {
      _id: uuidv4.toString(),
      name: faker.company.name() + ' - ' + faker.company.buzzPhrase(),
      position: {
        x: this.getRandomX(),
        y: this.getRandomY(),
        h: this.getRandomH(),
      },
      // modelId: this.modelList[Math.floor(Math.random() * this.modelList.length)].id
      modelId: this.modelList[Math.floor(Math.random() * this.modelList.length)]._id,
    } as Device
  }

  generateRacksList(count: number) {
    for (let i = 0; i < count; i++) {
      this.checkDistanceInDeviceList()
      this.racks.push(this.generateRandomDeviceRack())
    }
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
