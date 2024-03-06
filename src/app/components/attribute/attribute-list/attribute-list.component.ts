import { Component, OnInit, Input, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { LogService } from 'src/app/services/log.service'

import { Attribute } from 'src/app/shared/attribute'
import { AttributeService } from 'src/app/services/attribute.service'

import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

import { Model } from 'src/app/shared/model'
import { ModelsService } from 'src/app/services/models.service'

import { Connection } from 'src/app/shared/connection'
import { ConnectionService } from 'src/app/services/connection.service'

import { AttributeDictionary } from 'src/app/shared/attribute-dictionary'
import { AttributeDictionaryService } from 'src/app/services/attribute-dictionary.service'

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
})
export class AttributeListComponent implements OnInit {
  @Input() attributeComponent: string // type of object
  @Input() attributeComponentObject: string // string with Object

  attributeList: Attribute[] = []
  selectedAttribute: Attribute
  attributePage = 1
  component = 'Attributes'

  deviceDictionary: Device[] = []
  modelDictionary: Model[] = []
  connectionDictionary: Connection[] = []
  attributeDictionary: AttributeDictionary[] = []

  device: Device = new Device() // for find attributes
  model: Model
  connection: Connection

  constructor(
    public attributeService: AttributeService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService
  ) { }

  public toString(str: string | number | boolean | object | null | undefined) {
    return JSON.stringify(str, null, 2)
  }

  ngOnInit() {
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()

    this.LoadAttributes()
  }
  private LoadAttributes() {
    // @TODO: #62 show data depends of context attributeComponent and attributeComponentObject
    console.log('-------------------<  LoadAttributes  >-------------------')
    if (this.attributeComponent == 'Device' && this.attributeComponentObject != null) {
      console.log(
        '>>>> LoadAttributes.GetContextAttributes: ' +
        this.attributeComponent +
        ' ' +
        this.attributeComponentObject +
        ' JSON.stringify: ' +
        JSON.stringify(this.attributeComponentObject)
      )
      this.attributeList = this.attributeService.GetContextAttributes(
        this.attributeComponent,
        this.attributeComponentObject
      )
    } else {
      console.log(
        '>>>> LoadAttributes.attributeService.GetAttributesSync()'
      )
      this.attributeList = this.attributeService.GetAttributesSync()
    }
  }

  DeleteAttribute(id: string) {
    this.logService.CreateLog({
      message: id,
      objectId: id,
      operation: 'Delete',
      component: this.component,
    })
    return this.attributeService.DeleteAttribute(id).subscribe((data: Attribute) => {
      console.log(data)
      this.LoadAttributes()
      this.router.navigate(['/attribute-dictionary-list'])
    })
  }
  async CloneAttribute(id: string | null) {
    const id_new: string = this.attributeService.CloneAttribute(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: this.component,
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('attributes-list'))
      })
  }
  AddAttribute() {
    this.router.navigateByUrl('add-attribute')
  }
  EditAttribute(attribute: Attribute) {
    this.selectedAttribute = attribute
    this.router.navigate(['edit-attribute', this.selectedAttribute._id])
  }
  getDevice(id: string) {
    return this.deviceService.GetDevice(id).subscribe((data: Device) => {
      this.device = data
    })
  }
  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }
  findDeviceName(id: string | null): string {
    return this.deviceDictionary.find((e) => e._id === id)?.name as string
  }
  findModelName(id: string | null): string {
    return this.modelDictionary.find((e) => e._id === id)?.name as string
  }
  getModelList() {
    return this.modelService.GetModels().subscribe((data: Model[]) => {
      const tmp = new Model()
      data.unshift(tmp)
      this.modelDictionary = data
    })
  }
  getConnectionList() {
    return this.connectionService.GetConnections().subscribe((data: Connection[]) => {
      const tmp = new Connection()
      data = [tmp, ...data]
      this.connectionDictionary = data
    })
  }
  findConnectionName(id: string | null): string {
    return this.connectionDictionary.find((e) => e._id === id)?.name as string
  }
  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributeDictionary[]) => {
      const tmp = new AttributeDictionary()
      data = [tmp, ...data]
      this.attributeDictionary = data
    })
  }
  findAttributeDictionary(id: string | null): string {
    return this.attributeDictionary.find((e) => e._id === id)?.name as string
  }
}
