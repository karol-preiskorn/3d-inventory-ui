import { ObjectId } from 'mongodb';
import { Subscription } from 'rxjs';
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service';
import { AttributeService } from 'src/app/services/attribute.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { DeviceService } from 'src/app/services/device.service';
import { FloorService } from 'src/app/services/floor.service';
import { Log, LogService } from 'src/app/services/log.service';
import { ModelsService } from 'src/app/services/models.service';
import { Attribute } from 'src/app/shared/attribute';
import { AttributeDictionary } from 'src/app/shared/attribute-dictionary';
import { Connection } from 'src/app/shared/connection';
import { Device } from 'src/app/shared/device';
import { Floor } from 'src/app/shared/floor';
import { Model } from 'src/app/shared/model';

import { Component, Input, OnInit } from '@angular/core';

const api = [
  { component: 'Models', api: 'models' },
  { component: 'Devices', api: 'devices' },
  { component: 'Logs', api: 'logs' },
  { component: 'Attributes', api: 'attributes' },
  { component: 'Attribute Dictionary', api: 'attribute-dictionary' },
  { component: 'Connection', api: 'connections' },
  { component: 'Floor', api: 'floor' },
]

/**
 * Checks if the given component is present in the API settings.
 * @param component - The component to check.
 * @returns `true` if the component is found in the API settings, `false` otherwise.
 */
function isApiSettings(component: string): boolean {
  return api.find((e) => e.component === component) ? true : false
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {
  LogList: Log[] = []

  @Input() component = ''
  @Input() attributeComponentObject: object = {}

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
   * Loads the log for the specified context. found log context in share service with store variables
   * @param context - The context for which the log is being loaded.
   */
  loadLog(context: string, component: string) {
    if (isApiSettings(component)) {
      console.log(
        'LoadComponent.loadLog (call loadComponentLog) - Context: ' +
          context +
          ', loadComponentLog: ' +
          component +
          ' attributeComponentObject: ' +
          JSON.stringify(this.attributeComponentObject),
      )
      this.loadComponentLog(component)
    } else {
      console.log('LoadComponent.loadLog (call loadObjectsLog) - Context: ' + context + ', loadObjectLog: ' + component)
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
   * @returns void
   */
  OnChanges() {
    this.loadLog('ngOnChanges', this.component)
  }

  /**
   * Deletes a log entry with the specified ID.
   * @param id - The ID of the log entry to delete.
   * @returns An Observable that emits the deleted log entry.
   */
  DeleteLog(id: ObjectId) {
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
    })
  }

  /**
   * @description Depends on type log find usable information from log.message
   * @param {Log} log - The log object containing the message.
   * @return {string} The name found in the log message.
   * @memberof LogComponent
   */
  findNameInLogMessage(log: Log): string {
    let jLog: object
    try {
      jLog = JSON.parse(JSON.stringify(log.message))
    } catch (error) {
      console.log('findNameInLogMessage: ' + JSON.stringify(log.message) + ' ' + error)
      return JSON.stringify(log.message)
    }
    //console.log('jLog: ' + JSON.stringify(jLog, null, ' '))
    if (log.component == 'Attribute') {
      const jAttribute: Attribute = log.message as Attribute
      console.log('jAttribute: ' + JSON.stringify(jAttribute, null, ' '))
      console.log('findNameInLogMessage: ' + JSON.stringify(jAttribute, null, ' '))
      if (jAttribute.connectionId !== null) {
        this.getConnectionList()
        console.log('Connection: ' + this.findConnectionName(jAttribute.connectionId))
        return 'Connection ' + this.findConnectionName(jAttribute.connectionId)
      }
      if (jAttribute.modelId !== null) {
        this.getModelList()
        if (jAttribute.connectionId !== null) {
          return 'Model ' + this.findModelName(jAttribute.connectionId)
        }
      }
      if (jAttribute.deviceId !== null) {
        this.getDeviceList()
        return 'Device ' + this.findDeviceName(jAttribute.connectionId)
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
      // Specify the correct type for the data parameter
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
  findDeviceName(id: ObjectId) {
    if (id === null) {
      return null
    }
    if (typeof id === 'string') {
      id = new ObjectId(id);
    }
    return this.deviceList.find((e) => e._id === id)?.name;
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
  findModelName(id: ObjectId) {
    return this.modelList.find((e) => e._id === ObjectId.createFromHexString(id.toString()))?.name
  }

  /**
   * Retrieves the connection list.
   *
   * @returns An Observable that emits the connection list.
   */
  getConnectionList() {
    if (this.connectionListGet == true) return null
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
  findConnectionName(id: ObjectId) {
    return this.connectionList.find((e) => e._id === ObjectId.createFromHexString(id.toString()))?.name
  }

  /**
   * Retrieves the attribute dictionary list.
   *
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
  findAttributeDictionaryName(id: ObjectId) {
    return this.attributeDictionaryList.find((e) => e._id === id)?.name
  }

  /**
   * Retrieves the attribute list.
   * @returns {Observable<Attribute[]>} An observable that emits the attribute list.
   */
  getAttributeList(): void {
    if (this.attributeListGet == true) return
    this.attributeService.GetAttributes().subscribe((data: Attribute[]) => {
      // Specify the correct type for the data parameter
      const tmp = new Attribute()
      data.unshift(tmp)
      this.attributeList = data as Attribute[]
      this.attributeListGet = true
    })
  }

  /**
   * Finds an attribute in the attribute list based on the given ID.
   * @param id - The ID of the attribute to find.
   * @returns The attribute object if found, or undefined if not found.
   */
  findAttribute(id: ObjectId) {
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
  findFloor(id: ObjectId) {
    return this.floorList.find((e) => e.id === ObjectId.createFromHexString(id.toString()))
  }
}
