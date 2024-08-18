/**
 * This file contains the tests for the DeviceList class.
 * @todo #1:30min Continue implementing the tests for the DeviceList class.
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { Device } from './device';
import { DeviceList } from './devicesList';

describe('DeviceList', () => {
  let deviceList: DeviceList

  beforeEach(() => {
    deviceList = new DeviceList()
  })

  it('should create an empty device list', () => {
    expect(deviceList.get()).toEqual([])
  })

  it('should push a device to the list', () => {
    const device: Device = { name: 'Device 1', _id: '', modelId: '', position: { x: 0, y: 0, h: 0 } }
    deviceList.push(device)
    expect(deviceList.get()).toEqual([device])
  })

  it('should print the devices in the list', () => {
    const device1: Device = new Device()
    const device2: Device = new Device()
    deviceList.push(device1)
    deviceList.push(device2)

    // Mock console.log: `npm i --save-dev @types/mocha`
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    deviceList.print()

    expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    expect(consoleLogSpy).toHaveBeenCalledWith(device1.toString())
    expect(consoleLogSpy).toHaveBeenCalledWith(device2.toString())

    // Restore console.log
    consoleLogSpy.mockRestore()
  })
})
