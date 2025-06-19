import { lastValueFrom } from 'rxjs'

import { Component, Input, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { AttributeService } from '../../../services/attribute.service'
import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Attribute } from '../../../shared/attribute'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'
import { CommonModule } from '@angular/common'
import { LogComponent } from '../../log/log.component'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
  standalone: true,
  imports: [CommonModule, LogComponent, NgbPaginationModule],
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
  attributePage = 1 // Current page
  pageSize = 5 // Number of items per page
  totalItems = 0 // Total number of items
  component = 'attributes'
  componentName = 'Attributes'

  deviceDictionary: Device[] = []
  modelDictionary: Model[] = []
  connectionDictionary: Connection[] = []
  attributeDictionary: AttributesDictionary[] = []

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

  async ngOnInit() {
    this.getDeviceList()
    this.getModelList()
    this.getConnectionList()
    this.getAttributeDictionaryList()
    await this.LoadAttributes()
  }

  private async LoadAttributes() {
    // @TODO: #62 show data depends of context attributeComponent and attributeComponentObject
    console.log('-------------------<  LoadAttributes  >-------------------')
    if (this.attributeComponent === 'Device' && this.attributeComponentObject != null) {
      console.log(
        'LoadAttributes.GetContextAttributes: ' + this.attributeComponent + ' ' + this.attributeComponentObject,
      )
      this.attributeList = await this.attributeService.GetContextAttributes(
        this.attributeComponent,
        this.attributeComponentObject,
      )
    } else {
      console.log('LoadAttributes.attributeService.GetAttributesSync()')
      this.attributeList = await this.attributeService.GetAttributesSync()
      this.totalItems = this.attributeList.length // Set total items
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
    try {
      // Clone the attribute and get the new attribute's ID
      const newId = this.attributeService.CloneAttribute(id)
      await this.logService
        .CreateLog({
          message: { id, id_new: newId },
          operation: 'Clone',
          component: this.component,
        })
        .toPromise()
      this.LoadAttributes()
      await this.router.navigateByUrl('attributes-list')
    } catch (error) {
      console.error('Error cloning attribute:', error)
    }
  }

  async AddAttribute() {
    await this.router.navigateByUrl('add-attribute')
  }

  async EditAttribute(attribute: Attribute) {
    this.selectedAttribute = attribute
    await this.router.navigate(['edit-attribute', this.selectedAttribute._id])
  }

  getDevice(id: string) {
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
    return this.connectionService.GetConnections().subscribe(
      (data: Connection[]) => {
        const tmp = new Connection()
        data.unshift(tmp)
        this.connectionDictionary = data
      },
      (error) => {
        console.error('Error fetching connections:', error)
      },
    )
  }

  findConnectionName(id: string): string {
    return this.connectionDictionary.find((e) => e._id === id)?.name as string
  }

  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributesDictionary[]) => {
      const tmp = new AttributesDictionary()
      data = [tmp, ...data]
      this.attributeDictionary = data
    })
  }

  findAttributeDictionaryName(id: string): string {
    return (this.attributeDictionary.find((e) => e._id === id)?.name as string) || ''
  }
}
