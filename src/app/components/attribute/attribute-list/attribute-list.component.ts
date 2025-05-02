import { lastValueFrom } from 'rxjs';

import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service';
import { AttributeService } from '../../../services/attribute.service';
import { ConnectionService } from '../../../services/connection.service';
import { DeviceService } from '../../../services/device.service';
import { LogService } from '../../../services/log.service';
import { ModelsService } from '../../../services/models.service';
import { Attribute } from '../../../shared/attribute';
import { AttributeDictionary } from '../../../shared/attribute-dictionary';
import { Connection } from '../../../shared/connection';
import { Device } from '../../../shared/device';
import { Model } from '../../../shared/model';

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
})
export class AttributeListComponent implements OnInit {
  /**
   * The attribute component to be displayed.
   * @type {string}
   */
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
    private attributeDictionaryService: AttributeDictionaryService,
  ) {}

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
    if (this.attributeComponent === 'Device' && this.attributeComponentObject != null) {
      console.log(
        'LoadAttributes.GetContextAttributes: ' + this.attributeComponent + ' ' + this.attributeComponentObject,
      )
      this.attributeList = this.attributeService.GetContextAttributes(
        this.attributeComponent,
        this.attributeComponentObject,
      )
    } else {
      console.log('LoadAttributes.attributeService.GetAttributesSync()')
      this.attributeList = this.attributeService.GetAttributesSync()
    }
  }

  async navigateMethod() {
    try {
      // Perform some operations here
      await this.router.navigate(['/attribute-dictionary-list'])
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }
  async DeleteAttribute(id: string) {
    try {
      await this.logService
        .CreateLog({
          message: { id: id },
          objectId: id,
          operation: 'Delete',
          component: this.component,
        })
        .toPromise() // Convert observable to promise and await it

      const data: Attribute = await lastValueFrom(this.attributeService.DeleteAttribute(id)) // Await the deletion

      console.log(data)
      this.LoadAttributes()
      await this.navigateMethod()
    } catch (error) {
      console.error('Error deleting attribute:', error)
    }
  }

  async CloneAttribute(id: string) {
    await this.logService
      .CreateLog({
        message: { id: id, id_new: 'todo!' },
        operation: 'Clone',
        component: this.component,
      })
      .toPromise()
    await this.ngZone.run(() => this.router.navigateByUrl('attributes-list'))
  }

  async AddAttribute() {
    await this.router.navigateByUrl('add-attribute')
  }

  async EditAttribute(attribute: Attribute) {
    this.selectedAttribute = attribute
    await this.router.navigate(['edit-attribute', this.selectedAttribute._id])
  }

  etDevice(id: string) {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const foundDevice = data.find((device: Device): boolean => device._id === id)
      if (foundDevice) {
        this.device = foundDevice
      } else {
        console.error(`Device with id ${id} not found`)
        // Handle the case where the device is not found, e.g., set this.device to null or show an error message
        this.device = new Device() // or null
      }
    })
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }

  findDeviceName(id: string): string {
    if (id === null) {
      return ''
    }
    return this.deviceDictionary.find((e) => e._id === id)?.name as string
  }

  findModelName(id: string): string {
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
      // data = [tmp, ...data]
      data.unshift(tmp)
      this.connectionDictionary = data
    })
  }

  findConnectionName(id: string): string {
    return this.connectionDictionary.find((e) => e._id === id)?.name as string
  }

  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributeDictionary[]) => {
      const tmp = new AttributeDictionary()
      data = [tmp, ...data]
      this.attributeDictionary = data
    })
  }

  findAttributeDictionary(id: string): string {
    return this.attributeDictionary.find((e) => e._id === id)?.name as string
  }
}
