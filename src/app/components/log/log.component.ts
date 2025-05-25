/**
 * Represents the LogComponent, which is responsible for managing and displaying logs
 * related to various components and objects in the application.
 *
 * This component interacts with multiple services to fetch and display logs, as well as
 * retrieve related data such as devices, models, connections, attributes, and floors.
 * It provides methods for loading logs, deleting logs, and finding related information
 * based on log messages.
 *
 * @remarks
 * - The component uses Angular',s `OnInit` lifecycle hook to initialize and load logs.
 * - It also listens for changes in input properties to reload logs dynamically.
 * - The component relies on various services to fetch data and manage logs.
 *
 * @example
 * <app-log [component]="'Devices'" [attributeComponentObject]="deviceObject"></app-log>
 *
 * @see {@link LogService}, {@link AttributeService}, {@link DeviceService}, {@link ModelsService}, {@link ConnectionService}, {@link AttributeDictionaryService}, {@link FloorService}
 */

import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'

import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'

import { AttributeDictionaryService } from '../../services/attribute-dictionary.service'
import { AttributeService } from '../../services/attribute.service'
import { ConnectionService } from '../../services/connection.service'
import { DeviceService } from '../../services/device.service'
import { FloorService } from '../../services/floor.service'
import { Log, LogService } from '../../services/log.service'
import { ModelsService } from '../../services/models.service'
import { Attribute } from '../../shared/attribute'
import { AttributeDictionary } from '../../shared/attribute-dictionary'
import { Connection } from '../../shared/connection'
import { Device } from '../../shared/device'
import { Floor } from '../../shared/floor'
import { Model } from '../../shared/model'

const api = [
  { component: 'Models', api: 'models' },
  { component: 'Devices', api: 'devices' },
  { component: 'Logs', api: 'logs' },
  { component: 'Attributes', api: 'attributes' },
  { component: 'Attribute Dictionary', api: 'attribute-dictionary' },
  { component: 'Connection', api: 'connections' },
  { component: 'Connections', api: 'connections' },
  { component: 'Floors', api: 'floors' },
  { component: '3d', api: '3d' },
]

function isApiName(component: string): boolean {
  return !!api.find((e) => e.component === component)
}

function isComponentName(apiName: string): boolean {
  return api.some((e) => e.api === apiName)
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbPagination],
})
export class LogComponent implements OnInit {
  LogList: Log[] = []
  logListPage = 1 // Current page
  pageSize = 10 // Number of items per page
  totalItems = 0 // Total number of items

  @Input() component: string
  @Input() attributeComponentObject: Device = new Device()

  deviceList: Device[]
  modelList: Model[]
  connectionList: Connection[]
  attributeDictionaryList: AttributeDictionary[]
  attributeList: Attribute[]
  floorList: Floor[]

  deviceListGet = false
  modelListGet = false
  connectionListGet = false
  attributeDictionaryListGet = false
  attributeListGet = false
  floorListGet = false

  pageLog = 1
  hideWhenNoLog = false
  noData = false
  preLoader = false

  constructor(
    public logService: LogService,
    private attributeService: AttributeService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService,
    private floorService: FloorService,
  ) {}

  /**
   * Loads the log for the specified context.
   * @param context - The context for which the log is being loaded.
   * @param component - The component for which the log is being loaded.
   */
  loadLog(context: string, component: string) {
    if (isApiName(component)) {
      console.log(
        'LoadComponent.loadLog (call loadComponentLog) - Context: ' +
          context +
          ', loadComponentLog: ' +
          (component ?? '') +
          ' attributeComponentObject: ' +
          JSON.stringify(this.attributeComponentObject),
      )
      this.loadComponentLog(component)
    } else {
      console.log(
        'LoadComponent.loadLog (call loadObjectsLog) - Context: ' + context + ', loadObjectLog: ' + (component ?? ''),
      )
      this.loadObjectsLog(component)
    }
  }

  /**
   * Initializes the component.
   * This method is called after the component has been created and initialized.
   */
  ngOnInit() {
    this.loadLog('ngOnInit', this.component)
  }

  /**
   * Called whenever one or more input properties of the component change.
   */
  OnChanges() {
    this.loadLog('ngOnChanges', this.component)
  }

  /**
   * Deletes a log entry with the specified ID.
   * @param id - The ID of the log entry to delete.
   * @returns An Observable that emits the deleted log entry.
   */
  DeleteLog(id: string) {
    return this.logService.DeleteLog(id).subscribe((data: Log) => {
      console.log(data)
      this.OnChanges()
      // this.router.navigate(['/log-list/'])
    })
  }

  /**
   * Loads the component logs for the specified ID.
   * @param id - The ID of the component.
   * @returns A subscription object for the log data.
   */
  loadComponentLog(id: string): Subscription {
    return this.logService.GetComponentLogs(id).subscribe((data: Log[]) => {
      console.log('LogComponent.loadComponentLog(' + id + '): ' /* + JSON.stringify(data, null, ' ') */)
      this.LogList = data
      this.totalItems = this.LogList.length // Update totalItems for pagination
    })
  }

  /**
   * Loads the objects log for the specified ID.
   * @param id - The ID of the object.
   * @returns A Subscription object representing the subscription to the log data.
   */
  loadObjectsLog(id: string): Subscription {
    return this.logService.GetObjectLogs(id).subscribe((data: Log[]) => {
      console.log('LogComponent.loadObjectsLog(' + id + '): ' /* + JSON.stringify(data, null, ' ') */)
      this.LogList = data
      this.totalItems = this.LogList.length // Update totalItems for pagination
    })
  }

  /**
   * Depends on type log find usable information selector: 'app-log', from log.message.
   * @param log - The log object containing the message.
   * @returns The name found in the log message.
   */
  findNameInLogMessage(log: Log): string {
    let jLog: Log
    let findConnectionNameValue: string

    if (!log) {
      console.error('Log message is undefined')
      return ''
    }
    try {
      jLog = JSON.parse(JSON.stringify(log.message)) as Log
    } catch (error: unknown) {
      console.log(`findNameInLogMessage: ${String(log.message)} is not a JSON string` + String(error))
      return JSON.stringify(log.message)
    }
    if (log.component == 'Attribute') {
      const logMessageAttribute: Partial<Attribute> = log.message as Partial<Attribute>
      console.log('logMessageAttribute: ' + JSON.stringify(logMessageAttribute, null, ' '))
      if (!logMessageAttribute) {
        if (
          (logMessageAttribute as Partial<Attribute>).connectionId !== null &&
          (logMessageAttribute as Partial<Attribute>).connectionId !== undefined
        ) {
          this.getConnectionList()
          ;(findConnectionNameValue = this.findConnectionName(
            (logMessageAttribute as Partial<Attribute>).connectionId ?? '',
          )),
            console.log(
              `Find ConnectionName for Attribute (${(logMessageAttribute as Partial<Attribute>)?.connectionId ?? 'Unknown'}): ${findConnectionNameValue}`,
            )
          return 'Connection ' + findConnectionNameValue
        }
        if (
          (logMessageAttribute as Attribute).modelId !== null &&
          (logMessageAttribute as Attribute).modelId !== undefined
        ) {
          this.getModelList()
          if ((logMessageAttribute as Partial<Attribute>).connectionId !== null) {
            return 'Model ' + this.findModelName((logMessageAttribute as Partial<Attribute>).modelId ?? '')
          }
        }
        if (
          (logMessageAttribute as Attribute).deviceId !== null &&
          (logMessageAttribute as Attribute).deviceId !== undefined
        ) {
          this.getDeviceList()
          return 'Device ' + this.findDeviceName((logMessageAttribute as Partial<Attribute>).deviceId ?? '')
        }
      }
    }
    return JSON.stringify(jLog, null, ' ')
  }

  /**
   * Retrieves the device list from the device service.
   * If the device list has already been retrieved, returns null.
   * Otherwise, subscribes to the GetDevices method of the device service and updates the device list.
   * @returns An Observable that emits the device list.
   */
  getDeviceList() {
    if (this.deviceListGet == true) return null
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
      this.deviceListGet = true
    })
  }

  /**
   * Finds the device name based on the provided ID.
   * @param id - The ID of the device.
   * @returns The name of the device if found, otherwise undefined.
   */
  findDeviceName(id: string) {
    return this.deviceList.find((e) => e._id === id)?.name
  }

  /**
   * Retrieves the model list from the model service.
   * If the model list has already been fetched, it returns null.
   * Otherwise, it subscribes to the GetModels() method of the model service and updates the model list.
   * @returns An Observable that emits the model list.
   */
  getModelList() {
    if (this.modelListGet == true) return null
    return this.modelService.GetModels().subscribe((data: Model[]) => {
      // Specify the correct type for the data parameter
      const tmp = new Model()
      data.unshift(tmp)
      this.modelList = data
      this.modelListGet = true
    })
  }

  /**
   * Finds the model name based on the provided ID.
   * @param id - The ID of the model.
   * @returns The name of the model if found, otherwise undefined.
   */
  findModelName(id: string) {
    return this.modelList.find((e) => e._id === id)?.name
  }

  /**
   * Retrieves the connection list from the connection service.
   * If the connection list has already been fetched, it returns null.
   * Otherwise, it subscribes to the GetConnections() method of the connection service and updates the connection list.
   * @returns An Observable that emits the connection list.
   * Fetches the list of connections from the connection service and assigns it to the `connectionList` property.
   * Logs an error message to the console if the request fails.
   */
  getConnectionList(): void {
    this.connectionService.GetConnections().subscribe(
      (data) => {
        this.connectionList = data
      },
      (error) => {
        console.error('Error fetching connection list:', error)
      },
    )
  }

  /**
   * Finds the connection name based on the provided ID.
   * @param id - The ID of the connection.
   * @returns The name of the connection if found, otherwise undefined.
   */
  findConnectionName(connectionId: string): string {
    if (!this.connectionList || this.connectionList.length === 0) {
      console.warn('Connection list is empty or not initialized')
      return 'Unknown Connection'
    }

    const connection = this.connectionList.find((conn) => conn._id === connectionId)
    if (!connection) {
      console.warn(`No connection found for ID: ${connectionId}`)
      return 'Unknown Connection'
    }

    return connection.name
  }

  /**
   * Retrieves the attribute dictionary list.
   * @returns An Observable that emits the attribute dictionary list.
   */
  getAttributeDictionaryList() {
    if (this.attributeDictionaryListGet == true) return null
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributeDictionary[]) => {
      data.forEach((item) => {
        this.attributeDictionaryList.push(item)
      })
    })
  }

  /**
   * Finds the name of the attribute dictionary with the given ID.
   * @param id - The ID of the attribute dictionary.
   * @returns The name of the attribute dictionary, or undefined if not found.
   */
  findAttributeDictionaryName(id: string) {
    return this.attributeDictionaryList.find((e) => e._id === id)?.name
  }

  /**
   * Retrieves the attribute list.
   * @returns An observable that emits the attribute list.
   */
  getAttributeList(): void {
    if (this.attributeListGet == true) return
    this.attributeService.GetAttributes().subscribe((data: Attribute[]) => {
      // Specify the correct type for the data parameter
      const tmp = new Attribute()
      data.unshift(tmp)
      this.attributeList = data
      this.attributeListGet = true
    })
  }

  /**
   * Finds an attribute in the attribute list based on the given ID.
   * @param id - The ID of the attribute to find.
   * @returns The attribute object if found, or undefined if not found.
   */
  findAttribute(id: string) {
    return this.attributeList.find((e) => e._id === id)
  }

  /**
   * Retrieves the floor list from the attribute service.
   * If the attribute list has already been retrieved, returns null.
   * Otherwise, subscribes to the GetAttributes method of the attribute service
   * and updates the attribute list with the retrieved data.
   * @returns An Observable that emits the retrieved attribute list.
   */
  getFloorList() {
    // Implementation goes here
    if (this.attributeListGet == true) return null
    return this.attributeService.GetAttributes().subscribe((data: Attribute | Attribute[]) => {
      const tmp = new Attribute()
      if (Array.isArray(data)) {
        data.unshift(tmp)
        this.attributeList = data
      } else {
        this.attributeList = [tmp, data]
      }
      this.attributeListGet = true
    })
  }

  /**
   * Finds a floor in the floorList based on the provided id.
   * @param id - The id of the floor to find.
   * @returns The found floor object, or undefined if no floor with the given id is found.
   */
  findFloor(id: string) {
    return this.floorList.find((e) => e._id === id)
  }
}
