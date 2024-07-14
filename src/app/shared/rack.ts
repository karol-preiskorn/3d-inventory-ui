/*
 * File:        @/src/app/shared/rack.ts
 *
 * Description: modeling rack -< devices
 *
 * how modeling relations between devices and rack?
 *   units: Array<Device>
 *   units: Array<_DeviceId>
 *   units
 *
 * Used by:
 * Dependency:
 *
 * Date        By     Comments
 * ----------  -----  ---------------
 * 2023-08-08  C2RLO  Init racks
 */

import { DeviceService } from '../services/device.service'
import { LogService } from '../services/log.service'
import { ModelsService } from '../services/models.service'
import { Device } from './device'

export class Rack {
  device: Device
  units: Array<Device> // rendudance we need only Id

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private logService: LogService,
  ) {}

  private addUnit(device: Device) {
    this.units.push(device)
  }
}
