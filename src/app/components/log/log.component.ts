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
  { component: 'Model', name: 'Model' },
  { component: 'Models', name: 'Model' },
  { component: 'Device', name: 'Device' },
  { component: 'Devices', name: 'Device' },
  { component: 'Log', name: 'Log' },
  { component: 'Logs', name: 'Log' },
  { component: 'Attributes', name: 'Attribute' },
  { component: 'Attribute Dictionary', name: 'Attribute Dictionary' },
  { component: 'Connection', name: 'Connection' },
  { component: 'Connections', name: 'Connection' },
  { component: 'Floor', name: 'Floor' },
  { component: 'Floors', name: 'Floor' },
  { component: '3d', name: '3d' },
]

function getComponentName(component: string): string | undefined {
  const found = api.find((e) => e.component === component);
  return found ? found.name : undefined;
}

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
  connectionList: Connection[] = []
  attributeDictionaryList: AttributeDictionary[]
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
      const componentName = this.getComponentName(component)
      console.warn(
        `[LoadComponent.loadLog] Context: ${context}, getComponentName(${component})->${componentName}. AttributeComponentObject: ${JSON.stringify(this.attributeComponentObject)}`)

      if (componentName) {
        console.info(`[LoadComponent.loadLog] Component name for getComponentName(${component}) -> ${componentName} - component.`)
        this.loadComponentLog(componentName);
      } else {
        console.error(`[LoadComponent.loadLog] Component name for getComponentName(${component}) -> ${componentName} - component is undefined.`)
      }
    } else {
      console.error(`[LoadComponent.loadLog] Context: ${context} isApiName(${component}) - not found.`)
      this.loadObjectsLog(component)
    }
  }

  /**
   * Retrieves the component name based on the provided component string.
   * @param component - The component string.
   * @returns The name of the component if found, otherwise undefined.
   */
  getComponentName(component: string): string | undefined {
    const found = api.find((e) => e.component === component);
    return found ? found.name : undefined;
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
      console.log(`LogComponent.loadComponentLogi(${id}):  + ${JSON.stringify(data)}.`)
      this.LogList = data
    })
  }

  /**
   * Loads the objects log for the specified ID.
   * @param id - The ID of the object.
   * @returns A Subscription object representing the subscription to the log data.
   */
  loadObjectsLog(id: string): Subscription {
    return this.logService.GetObjectLogs(id).subscribe((data: Log[]) => {
      console.log(`LogComponent.loadObjectsLog(${id}): ${JSON.stringify(data, null, ' ')}`)
      this.LogList = data
    })
  }

  /**
   * Depends on type log find usable information selector: 'app-log', from log.message.
   * @param log - The log object containing the message.
   * @returns The name found in the log message.
   */
  findNameInLogMessage(log: Log): string {
    let jLog: Log
    try {
      jLog = JSON.parse(JSON.stringify(log.message)) as Log
    } catch (error: unknown) {
      console.log(`findNameInLogMessage: ${String(log.message)} is not a JSON string` + String(error))
      return JSON.stringify(log.message)
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
   * Retrieves the connection list.

   * @returns An Observable that emits the connection list.
   */
  getConnectionList() {
    if (this.connectionListGet == true) return null
    this.connectionList = [] // Initialize the connectionList array
    return this.connectionService.GetConnections().subscribe((data: Connection[]) => {
      data.forEach((connection) => {
        this.connectionList.push(connection)
      })
      this.connectionListGet = true
    })
  }

  /**
   * Finds the connection name based on the provided ID.
   * @param id - The ID of the connection.
   * @returns The name of the connection if found, otherwise undefined.
   */
  findConnectionName(id: string) {
    return this.connectionList.find((e) => e._id === id)?.name
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
   * Finds a floor in the floorList based on the provided id.
   * @param id - The id of the floor to find.
   * @returns The found floor object, or undefined if no floor with the given id is found.
   */
  findFloor(id: string) {
    return this.floorList.find((e) => e._id === id)
  }
}
