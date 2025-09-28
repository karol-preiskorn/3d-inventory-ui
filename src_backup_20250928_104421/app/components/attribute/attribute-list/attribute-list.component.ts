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

  device: Device | null = new Device() // for find attributes
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
      let parsedObject: any = this.attributeComponentObject
      if (typeof this.attributeComponentObject === 'string') {
        try {
          parsedObject = JSON.parse(this.attributeComponentObject)
        } catch (e) {
          console.error('Failed to parse attributeComponentObject as JSON:', e)
          parsedObject = this.attributeComponentObject // fallback to original string
        }
      }
      this.attributeList = await this.attributeService.GetContextAttributes(this.attributeComponent, parsedObject)
    } else {
      console.log('LoadAttributes.attributeService.GetAttributesSync()')
      this.attributeList = await this.attributeService.GetAttributesSync()
      this.totalItems = this.attributeList.length // Set total items
    }
  }

  async navigateToAttributeList() {
    try {
      // Perform some operations here
      const navigationResult = await this.router.navigate(['/attribute-list'])
      if (!navigationResult) {
        console.error('Navigation to /attribute-list failed')
      }
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }

  async deleteAttribute(id: string) {
    try {
      await lastValueFrom(
        this.logService.CreateLog({
          message: { _id: id },
          objectId: id,
          operation: 'Delete',
          component: this.component,
        }),
      )
      const data: Attribute = await lastValueFrom(this.attributeService.DeleteAttribute(id))
      console.log(data)
      await this.LoadAttributes()
      await this.navigateToAttributeList()
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

  async fetchDevice(id: string) {
    try {
      const data: Device[] = await lastValueFrom(this.deviceService.GetDevices().pipe())
      const foundDevice = data.find((device: Device): boolean => device._id === id)
      if (foundDevice) {
        this.device = foundDevice
      } else {
        console.error(`Device with id ${id} not found`)
        // Handle the case where the device is not found, e.g., set this.device to null or show an error message
        this.device = new Device() // or null
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
      this.device = new Device()
    }
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceDictionary = data
    })
  }

  findDeviceName(id: string | null): string {
    if (id === null) {
      return ''
    }
    return (this.deviceDictionary.find((e) => e._id === id)?.name as string) ?? ''
  }

  findModelName(id: string): string {
    return (this.modelDictionary.find((e) => e._id === id)?.name as string) ?? ''
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
    return (this.connectionDictionary.find((e) => e._id === id)?.name as string) ?? ''
  }

  getAttributeDictionaryList() {
    return this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributesDictionary[]) => {
      const tmp = new AttributesDictionary()
      data = [tmp, ...data]
      this.attributeDictionary = data
    })
  }

  findAttributeDictionaryName(id: string): string {
    const name = this.attributeDictionary.find((e) => e._id === id)?.name
    return typeof name === 'string' ? name : ''
  }
}
