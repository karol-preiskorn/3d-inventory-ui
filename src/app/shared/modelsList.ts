/*
 * Description:
 * 2023-05-16   C2RLO
 */

import { Model } from './model'

export class ModelsList {
  modelsList: Model[] = []

  get(): Model[] {
    return this.modelsList
  }

  push(model: Model) {
    this.modelsList.push(model)
  }

  pop(): Model | undefined {
    return this.modelsList.pop()
  }
}
