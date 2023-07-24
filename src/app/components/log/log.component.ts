import {Component, OnInit, Input} from '@angular/core'
import {Subscription} from 'rxjs'

import {Log, LogService} from 'src/app/services/log.service'

import {EnvironmentService} from 'src/app/services/environment.service'

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

  deviceListGet = false
  modelListGet = false
  connectionListGet = false
  attributeDictionaryListGet = false
  attributeListGet = false

  pageLog = 1
  hideWhenNoLog = false
  noData = false
  preLoader = false
  private sub: any

  constructor(
    public logService: LogService,
    private environmentService: EnvironmentService,
    private attributeService: AttributeService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService
  ) {}

  loadLog(context: string) {
    //console.log(this.environmentService.isApiSettings(this.component))
    // found log context in share service with strore variables
    if (this.environmentService.isApiSettings(this.component)) {
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

  loadComponentLog(id: string): Subscription {
    return this.logService.GetComponentLogs(id).subscribe((data: Log[]) => {
      //console.log('LogComponent.loadComponentLog(' + id + '): ' + JSON.stringify(data))
      this.LogList = data
    })
  }

  loadObjectsLog(id: string): Subscription {
    return this.logService.GetObjectsLogs(id).subscribe((data: Log[]) => {
      // console.log('LogComponent.loadObjectsLog(' + id + '): ' + JSON.stringify(data))
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
    if (log.component == 'Attributes') {
      const jAttribute: Attribute = JSON.parse(log.message)
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
    const jMessage = JSON.parse(log.message)
    return jMessage.name
  }

  getDeviceList() {
    if (this.deviceListGet == true) return null
    return this.deviceService.GetDevices().subscribe((data: any) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
      this.deviceListGet = true
    })
  }

  findDeviceName(id: string) {
    return this.deviceList.find((e) => e.id === id)?.name
  }

  getModelList() {
    if (this.modelListGet == true) return null
    return this.modelService.GetModels().subscribe((data: any) => {
      const tmp = new Model()
      data.unshift(tmp)
      this.modelList = data
      this.modelListGet = true
    })
  }

  findModelName(id: string) {
    return this.modelList.find((e) => e.id === id)?.name
  }

  getConnectionList() {
    if (this.connectionListGet == true) return null
    return this.connectionService.GetConnections().subscribe((data: any) => {
      const tmp = new Connection()
      data.unshift(tmp)
      this.connectionList = data
      this.connectionListGet = true
    })
  }

  findConnectionName(id: string) {
    return this.connectionList.find((e) => e.id === id)?.name
  }

  getAttributeDictionaryList() {
    if (this.attributeDictionaryListGet == true) return null
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: any) => {
      const tmp = new AttributeDictionary()
      data.unshift(tmp)
      this.attributeDictionaryList = data
    })
  }

  findAttributeDictionaryName(id: string) {
    return this.attributeDictionaryList.find((e) => e.id === id)?.name
  }

  getAttributeList() {
    if (this.attributeListGet == true) return null
    return this.attributeService.GetAttributes().subscribe((data: any) => {
      const tmp = new Attribute()
      data.unshift(tmp)
      this.attributeList = data
      this.attributeListGet = true
    })
  }

  findAttribute(id: string) {
    return this.attributeList.find((e) => e.id === id)
  }

  DeleteLog(id: string) {
    return this.logService.DeleteLog(id).subscribe((data: any) => {
      console.log(data)
      this.OnChanges()
      // this.router.navigate(['/log-list/'])
    })
  }
}
