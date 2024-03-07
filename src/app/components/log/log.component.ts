import {Component, OnInit, Input} from '@angular/core'
import {Subscription} from 'rxjs'

import {Log, LogService} from 'src/app/services/log.service'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import {Connection} from 'src/app/shared/connection'
import {ConnectionService} from 'src/app/services/connection.service'

import {AttributeDictionary} from 'src/app/shared/attribute-dictionary'
import {AttributeDictionaryService} from 'src/app/services/attribute-dictionary.service'

import {Attribute} from 'src/app/shared/attribute'
import {AttributeService} from 'src/app/services/attribute.service'

import {Floor} from 'src/app/shared/floor'
import {FloorService} from 'src/app/services/floor.service'

const api = [
  {component: 'Models', api: 'models'},
  {component: 'Devices', api: 'devices'},
  {component: 'Logs', api: 'logs'},
  {component: 'Attributes', api: 'attributes'},
  {component: 'Attribute Dictionary', api: 'attribute-dictionary'},
  {component: 'Connection', api: 'connections'},
  {component: 'Floor', api: 'floor'},
]

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
    private floorService: FloorService
  ) {}

  loadLog(context: string) {
    //console.log(this.environmentService.isApiSettings(this.component))
    // found log context in share service with store variables
    if (isApiSettings(this.component)) {
      console.log(context + '.loadComponentLog: ' + this.component)
      this.loadComponentLog(this.component)
    } else {
      console.log(context + '.loadObjectLog: ' + this.component)
      this.loadObjectsLog(this.component)
    }
  }

  ngOnInit() {
    this.loadLog('ngOnInit')
  }

  OnChanges() {
    this.loadLog('ngOnChanges')
  }

  DeleteLog(id: string) {
    return this.logService.DeleteLog(id).subscribe((data: Log) => {
      console.log(data)
      this.OnChanges()
      // this.router.navigate(['/log-list/'])
    })
  }

  loadComponentLog(id: string): Subscription {
    return this.logService.GetComponentLogs(id).subscribe((data: Log[]) => {
      console.log('LogComponent.loadComponentLog(' + id + '): ' + JSON.stringify(data, null, ' '))

      this.LogList = data
    })
  }

  loadObjectsLog(id: string): Subscription {
    return this.logService.GetObjectsLogs(id).subscribe((data: Log[]) => {
      console.log('LogComponent.loadObjectsLog(' + id + '): ' + JSON.stringify(data, null, ' '))
      this.LogList = data
    })
  }

  /**
   * @description depends on type log find usable information from message
   * @param {Log} log
   * @return {string} information about object
   * @memberof LogComponent
   */
  findNameInLogMessage(log: Log): string {
    let jLog: object
    try {
      jLog = JSON.parse(JSON.stringify(log.message))
    } catch (error) {
      console.log('findNameInLogMessage: ' + JSON.stringify(log.message) + ' ' + error)
      return log.message
    }
    console.log('jLog: ' + JSON.stringify(jLog, null, ' '))
    if (log.component == 'Attribute') {
      const jAttribute: Attribute = JSON.parse(log.message)
      console.log('jAttribute: ' + JSON.stringify(jAttribute, null, ' '))
      console.log('findNameInLogMessage: ' + JSON.stringify(jAttribute, null, ' '))
      if (jAttribute.connectionId != '') {
        this.getConnectionList()
        return 'Connection ' + this.findConnectionName(jAttribute.connectionId as string)
      }
      if (jAttribute.modelId != '') {
        this.getModelList()
        return 'Model ' + this.findModelName(jAttribute.connectionId as string)
      }
      if (jAttribute.deviceId != '') {
        this.getDeviceList()
        return 'Device ' + this.findDeviceName(jAttribute.connectionId as string)
      }
    }
    return JSON.stringify(jLog, null, ' ')
  }

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

  findDeviceName(id: string) {
    return this.deviceList.find((e) => e._id === id)?.name
  }

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

  findModelName(id: string) {
    return this.modelList.find((e) => e._id === id)?.name
  }

  getConnectionList() {
    if (this.connectionListGet == true) return null
    return this.connectionService.GetConnections().subscribe((data: Connection[]) => {
      data.forEach((connection) => {
        this.connectionList.push(connection)
      })
      this.connectionListGet = true
    })
  }

  findConnectionName(id: string) {
    return this.connectionList.find((e) => e._id === id)?.name
  }

  getAttributeDictionaryList() {
    if (this.attributeDictionaryListGet == true) return null
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributeDictionary[]) => {
      data.forEach((item) => {
        this.attributeDictionaryList.push(item)
      })
    })
  }

  findAttributeDictionaryName(id: string) {
    return this.attributeDictionaryList.find((e) => e._id === id)?.name
  }

  getAttributeList() {
    if (this.attributeListGet == true) return null
    return this.attributeService.GetAttributes().subscribe((data: Attribute[]) => {
      // Specify the correct type for the data parameter
      const tmp = new Attribute()
      data.unshift(tmp)
      this.attributeList = data
      this.attributeListGet = true
    })
  }

  findAttribute(id: string) {
    return this.attributeList.find((e) => e._id === id)
  }

  getFloorList() {
    if (this.attributeListGet == true) return null
    return this.attributeService.GetAttributes().subscribe((data: Attribute[]) => {
      // Specify the correct type for the data parameter
      const tmp = new Attribute()
      data.unshift(tmp)
      this.attributeList = data
      this.attributeListGet = true
    })
  }

  findFloor(id: string) {
    return this.floorList.find((e) => e.id === id)
  }
}
