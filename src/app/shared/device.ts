/**
 * Represents a position in a 3D space.
 * @property x - The x-coordinate of the position.
 * @property y - The y-coordinate of the position.
 * @property h - The height (z-coordinate) of the position.
 */
export interface Position {
  x: number
  y: number
  h: number
}

/**
 * Interface for a device object.
 * @property _id - The unique identifier of the device.
 * @property name - The name of the device.
 * @property modelId - The model identifier associated with the device.
 * @property position - The position of the device in 3D space.
 */
export interface DeviceInterface {
  _id: string
  name: string
  modelId: string
  position: Position
}

/**
 * Represents a device with a unique ID, name, model ID, and position.
 */
export class Device {
  /**
   * The unique identifier of the device.
   */
  _id: string = ''

  /**
   * The name of the device.
   */
  name: string = ''

  /**
   * The model identifier associated with the device.
   */
  modelId: string = ''

  /**
   * The position of the device in 3D space.
   */
  position: Position = { x: 0, y: 0, h: 0 }

  /**
   * Indicates whether debug mode is enabled.
   */
  isDebugMode = false

  /**
   * Creates an instance of the Device class.
   * @param name - The name of the device. Defaults to an empty string.
   * @param modelId - The model identifier of the device. Defaults to an empty string.
   * @param position - The position of the device in 3D space. Defaults to { x: 0, y: 0, h: 0 }.
   */
  constructor(name: string = '', modelId: string = '', position: Position = { x: 0, y: 0, h: 0 }) {
    this.name = name
    this.modelId = modelId
    this.position = position
  }

  /**
   * Returns a string representation of the device.
   * @returns A string containing the device ID and name.
   */
  toString(): string {
    return `Device ID: ${this._id || 'N/A'}, Name: ${this.name || 'N/A'}`
  }
}
