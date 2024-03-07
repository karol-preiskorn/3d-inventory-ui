/*
 * File:        /src/app/shared/modelsList.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-05-16   C2RLO
 */

import {Model} from './model'
export class ModelsList {
  modelsList: Model[] = []
  print() {
    this.modelsList.forEach((element) => {
      element.print()
    })
  }
  get(): Model[] {
    return this.modelsList
  }

  push(model: Model) {
    this.modelsList.push(model)
  }

  pop(): Model | undefined {
    return this.modelsList.pop()
  }

  // try {
  //   for (let index = 0; index < 10; index++) {
  //     const deviceTmp = new Device()
  //     devicesList.push(deviceTmp)
  //   }
  // } catch (err) {
  //   console.log('🐛 Generate devicesList', err)
  // }

  // console.log('Print devicesList')
  // devicesList.forEach((element, i) => {
  //   console.log(i + 1, element.getString())
  // })
}
