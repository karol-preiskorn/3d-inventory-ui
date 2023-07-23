import {Component, OnInit, Input, NgZone} from '@angular/core'
import {Router} from '@angular/router'
import {Subscription} from 'rxjs'

import {LogService} from 'src/app/services/log.service'

import {Attribute} from 'src/app/shared/attribute'
import {AttributeService} from 'src/app/services/attribute.service'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {Model} from 'src/app/shared/model'
import {ModelsService} from 'src/app/services/models.service'

import {Connection} from 'src/app/shared/connection'
import {ConnectionService} from 'src/app/services/connection.service'

import {AttributeDictionary} from 'src/app/shared/attribute-dictionary'
import {AttributeDictionaryService} from 'src/app/services/attribute-dictionary.service'

import {HttpClient} from '@angular/common/http'
import {ObjectIteratorTypeGuard} from 'lodash'

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
})
export class AttributeListComponent implements OnInit {
  @Input() attributeComponent: string       // type of object
  @Input() attributeComponentObject: string // string with Object

  attributeList: Attribute[] = []
  selectedAttribute: Attribute
  attributePage = 1
  component = 'Attributes'

  deviceDictionary: Device[]
  modelDictionary: Model[]
  connectionDictionary: Connection[]
  attributeDictionary: AttributeDictionary[]

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
    private attributeDictionaryService: AttributeDictionaryService,
    private http: HttpClient
  ) {}

  public toString(str: any) {
    return JSON.stringify(str)
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
    console.log('--------------- LoadAttributes ----------------------');
    if (this.attributeComponent == 'Device' && this.attributeComponentObject != null) {
      console.log('>>>> LoadAttributes.getDevice: ' + this.attributeComponent + ' ' + this.attributeComponentObject + ' JSON.stringify: ' + JSON.stringify(this.attributeComponentObject))
      this.attributeList = this.attributeService.GetContextAttributes(
        this.attributeComponent,
        this.attributeComponentObject
      )
      console.log('>>>> LoadAttributes.attributeList: ' + this.attributeList)
    } else {
      console.log('>>>> LoadAttributes.attributeService.GetAttributes')
      this.attributeService.GetAttributes().subscribe((data: Attribute[]) => {
        this.attributeList= data
      })
    }
  }

  DeleteAttribute(id: string) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: 'Attributes',
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
        component: 'Attributes',
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
    this.router.navigate(['edit-attribute', this.selectedAttribute.id])
  }

  getDevice(id: string) {
    return this.deviceService.GetDevice(id).subscribe((data: Device) => {
      this.device = data
    })
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: any) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }

  findDeviceName(id: string | null): string {
    return this.deviceDictionary.find((e) => e.id === id)?.name as string
  }

  getModelList() {
    return this.modelService.GetModels().subscribe((data: any) => {
      const tmp = new Model()
      data.unshift(tmp)
      this.modelDictionary = data
    })
  }

  findModelName(id: string | null): string {
    return this.modelDictionary.find((e) => e.id === id)?.name as string
  }

  getConnectionList() {
    return this.connectionService.GetConnections().subscribe((data: any) => {
      const tmp = new Connection()
      data.unshift(tmp)
      this.connectionDictionary = data
    })
  }

  findConnectionName(id: string | null): string {
    return this.connectionDictionary.find((e) => e.id === id)?.name as string
  }

  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: any) => {
      const tmp = new AttributeDictionary()
      data.unshift(tmp)
      this.attributeDictionary = data
    })
  }

  findAttributeDictionary(id: string | null): string {
    return this.attributeDictionary.find((e) => e.id === id)?.name as string
  }
}
