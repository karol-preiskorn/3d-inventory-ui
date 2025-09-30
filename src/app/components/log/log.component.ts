import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'
import { Log, LogService } from '../../services/log.service'
import { DeviceService } from '../../services/device.service'
import { ModelsService } from '../../services/models.service'
import { ConnectionService } from '../../services/connection.service'
import { AttributeService } from '../../services/attribute.service'
import { AttributeDictionaryService } from '../../services/attribute-dictionary.service'
import { FloorService } from '../../services/floor.service'
import { Device } from '../../shared/device'
import { Model } from '../../shared/model'
import { Connection } from '../../shared/connection'
import { Attribute } from '../../shared/attribute'
import { AttributesDictionary } from '../../shared/AttributesDictionary'
import { Floors } from '../../shared/floors'
import { DebugService } from '../../services/debug.service'

/**
 * LogComponent - Displays application logs with filtering and pagination
 * Modernized with Angular Signals for reactive state management
 */
@Component({
  selector: 'app-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgbPagination
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnDestroy {
  LogList: Log[] = []
  logListPage = 1 // Current page
  pageSize = 5 // Number of items per page
  totalItems = 0 // Total number of items

  private componentLogSubscription: Subscription | null = null
  private logsByIdSubscription: Subscription | null = null

  @Input() component: string = ''
  @Input() isComponent: boolean = false
  @Input() componentName: string = ''
  @Input() attributeComponentObject: Device = new Device()

  deviceList: Device[] = []
  modelList: Model[] = []
  connectionList: Connection[] = []
  attributeDictionaryList: AttributesDictionary[] = []
  attributeList: Attribute[] = []
  floorList: Floors[] = []

  deviceListGet = false
  modelListGet = false
  connectionListGet = false
  attributeDictionaryListGet = false
  attributeListGet = false
  floorListGet = false

  // Signals for reactive state management
  private isLoading = signal(true)
  private errorMessage = signal<string | null>(null)

  constructor(
    private logService: LogService,
    private attributeService: AttributeService,
    private deviceService: DeviceService,
    private modelService: ModelsService,
    private connectionService: ConnectionService,
    private attributeDictionaryService: AttributeDictionaryService,
    private floorService: FloorService,
    private cdr: ChangeDetectorRef,
    private debugService: DebugService,
  ) { }

  ngOnInit(): void {
    this.loadLog('ngOnInit')
  }

  /**
   * Loads the log for the specified context.
   */
  loadLog(_context: string): void {
    // Debug logging removed for production

    if (this.isComponent === true) {
      if (this.component) {
        // Loading logs by component
        this.loadComponentLog(this.component)
      } else {
        console.warn('[log.components.loadLog] Component is undefined, cannot load logs.')
      }
    } else {
      // Loading logs by id
      this.loadLogsById(this.component)
    }
  }

  /**
   * Deletes a log entry
   */
  deleteLog(id: string): void {
    this.logService.DeleteLog(id).subscribe((_data: Log) => {
      // Log deleted successfully
      this.loadLog('deleteLog')
      this.cdr.detectChanges()
    })
  }

  /**
   * Loads component logs for the specified ID
   */
  loadComponentLog(id: string): void {
    if (this.componentLogSubscription) {
      this.componentLogSubscription.unsubscribe()
      this.componentLogSubscription = null
    }

    // Loading component logs for specified ID
    this.isLoading.set(true)

    this.componentLogSubscription = this.logService.GetComponentLogs(id).subscribe({
      next: (data: Log[]) => {
        // Received logs successfully
        console.warn('✅ Loaded', data.length, 'logs for component', id);

        // If no component-specific logs found, load all logs as fallback
        if (data.length === 0) {
          console.warn('No component-specific logs found, loading all logs as fallback');
          this.loadAllLogsAsFallback();
          return;
        }

        this.LogList = data
        this.totalItems = data.length
        this.isLoading.set(false)
        this.errorMessage.set(null)
        // Trigger change detection since we're using OnPush strategy
        this.cdr.detectChanges()
      },
      error: (error: unknown) => {
        console.error(`[LogComponent] Error loading logs for component ID: ${id}`, error)
        // Try to load all logs as fallback when component query fails
        console.warn('Component query failed, trying to load all logs as fallback');
        this.loadAllLogsAsFallback();
      }
    })
  }

  /**
   * Loads all logs as fallback when component-specific logs are not available
   */
  private loadAllLogsAsFallback(): void {
    this.logService.GetLogs().subscribe({
      next: (data: Log[]) => {
        console.warn('✅ Fallback: Loaded', data.length, 'total logs');
        this.LogList = data
        this.totalItems = data.length
        this.isLoading.set(false)
        this.errorMessage.set(null)
        this.cdr.detectChanges()
      },
      error: (error: unknown) => {
        console.error(`[LogComponent] Error loading all logs as fallback:`, error)
        this.LogList = []
        this.totalItems = 0
        this.isLoading.set(false)
        this.errorMessage.set('Failed to load logs')
        this.cdr.detectChanges()
      }
    })
  }

  /**
   * Loads logs by object ID
   */
  loadLogsById(id: string): void {
    if (this.logsByIdSubscription) {
      this.logsByIdSubscription.unsubscribe()
    }

    this.isLoading.set(true)

    this.logsByIdSubscription = this.logService.GetLogsById(id).subscribe({
      next: (data: Log[]) => {
        // Logs loaded successfully
        console.warn('✅ Loaded', data.length, 'logs for object ID', id);
        this.LogList = data
        this.totalItems = data.length
        this.isLoading.set(false)
        this.errorMessage.set(null)
        this.cdr.detectChanges()
      },
      error: (error: unknown) => {
        console.error(`[LogComponent] Error loading logs by ID: ${id}`, error)
        this.LogList = []
        this.totalItems = 0
        this.isLoading.set(false)
        this.errorMessage.set('Failed to load logs')
        this.cdr.detectChanges()
      }
    })
  }

  /**
   * Get component name from log message
   */
  findNameInLogMessage(log: Log): string {
    try {
      const logMessage = typeof log.message === 'string' ? JSON.parse(log.message) : log.message
      const componentType = log.component?.toLowerCase()

      switch (componentType) {
        case 'device':
          return this.handleDeviceComponent(logMessage)
        case 'model':
          return this.handleModelComponent(logMessage)
        case 'attribute':
          return this.handleAttributeComponent(log)
        case 'connection':
          return this.handleConnectionComponent(log)
        case 'floor':
          return this.handleFloorComponent(logMessage)
        default:
          return `${log.component || 'Unknown'} Component`
      }
    } catch {
      return `${log.component || 'Unknown'} Component`
    }
  }

  private handleDeviceComponent(logMessage: Record<string, unknown>): string {
    if (!this.deviceListGet) {
      this.getDeviceList()
    }
    const deviceName = this.findDeviceName((logMessage.deviceId as string) || (logMessage._id as string) || '')
    return deviceName ? `Device ${deviceName}` : 'Device Component'
  }

  private handleModelComponent(logMessage: Record<string, unknown>): string {
    if (!this.modelListGet) {
      this.getModelList()
    }
    const modelName = this.findModelName((logMessage.modelId as string) || (logMessage._id as string) || '')
    return modelName ? `Model ${modelName}` : 'Model Component'
  }

  private handleFloorComponent(logMessage: Record<string, unknown>): string {
    const floorName = this.findFloor((logMessage.floorId as string) || (logMessage._id as string) || '')
    return floorName ? `Floor ${floorName}` : 'Floor Component'
  }

  private handleConnectionComponent(log: Log): string {
    let findConnectionNameValue = ''
    try {
      const logMessage = typeof log.message === 'string' ? JSON.parse(log.message) : log.message
      const logMessageAttribute = logMessage as Partial<Attribute>

      if (logMessageAttribute.connectionId) {
        if (!this.connectionListGet) {
          this.getConnectionList()
        }
        findConnectionNameValue = this.findConnectionName(logMessageAttribute.connectionId)
        return 'Connection ' + findConnectionNameValue
      } else if (logMessageAttribute.modelId) {
        if (!this.modelListGet) {
          this.getModelList()
        }
        return 'Model ' + this.findModelName(logMessageAttribute.modelId)
      }
    } catch (error) {
      console.error('[log.component] Error parsing log message:', error)
    }

    if (!this.deviceListGet) {
      this.getDeviceList()
    }
    return 'Device ' + this.findDeviceName('')
  }

  private handleAttributeComponent(log: Log): string {
    let findConnectionNameValue = ''
    try {
      const logMessage = typeof log.message === 'string' ? JSON.parse(log.message) : log.message
      const logMessageAttribute = logMessage as Partial<Attribute>

      if (logMessageAttribute.connectionId) {
        if (!this.connectionListGet) {
          this.getConnectionList()
        }
        findConnectionNameValue = this.findConnectionName(
          logMessageAttribute.connectionId ?? ''
        )
        return 'Connection ' + findConnectionNameValue
      } else if (logMessageAttribute.modelId) {
        if (!this.modelListGet) {
          this.getModelList()
        }
        return 'Model ' + this.findModelName(logMessageAttribute.modelId ?? '')
      }
    } catch (error) {
      console.error('[log.component] Error parsing attribute log message:', error)
    }

    if (!this.deviceListGet) {
      this.getDeviceList()
    }
    return 'Device ' + this.findDeviceName('')
  }

  /**
   * Format log message as pretty JSON
   */
  formatLogMessage(log: Log): string {
    try {
      const jLog = typeof log.message === 'string' ? JSON.parse(log.message) : log.message
      return JSON.stringify(jLog, null, 2)
    } catch {
      return typeof log.message === 'string' ? log.message : JSON.stringify(log.message)
    }
  }

  private getDeviceList(): void {
    if (this.deviceListGet) {
      return
    }

    this.deviceService.GetDevices().subscribe(
      (devices: Device[]) => {
        this.deviceList = devices
        this.deviceListGet = true
      }
    )
  }

  private findDeviceName(id: string): string {
    const device = this.deviceList.find((d: Device) => d._id === id)
    return device?.name || 'Unknown Device'
  }

  private getModelList(): void {
    if (this.modelListGet) {
      return
    }

    this.modelService.GetModels().subscribe(
      (models: Model[]) => {
        this.modelList = models
        this.modelListGet = true
      }
    )
  }

  private findModelName(id: string): string {
    const model = this.modelList.find((m: Model) => m._id === id)
    return model?.name || 'Unknown Model'
  }

  private getConnectionList(): void {
    if (this.connectionListGet) {
      return
    }

    this.connectionService.GetConnections().subscribe(
      (connections: Connection[]) => {
        this.connectionList = connections
        this.connectionListGet = true
      }
    )
  }

  private findConnectionName(connectionId: string): string {
    const connection = this.connectionList.find((c: Connection) => c._id === connectionId)
    if (connection) {
      return connection.name || 'Unknown Connection'
    }
    return 'Connection not found'
  }

  private getAttributeDictionaryList(): void {
    this.attributeDictionaryService.GetAttributeDictionaries().subscribe(
      (attributeDictionaries: AttributesDictionary[]) => {
        this.attributeDictionaryList = attributeDictionaries
        this.attributeDictionaryListGet = true
      }
    )
  }

  private findAttributeDictionaryName(id: string): string {
    const attributeDictionary = this.attributeDictionaryList.find((a: AttributesDictionary) => a._id === id)
    return attributeDictionary?.name || 'Unknown Attribute Dictionary'
  }

  private getAttributeList(): void {
    if (this.attributeListGet) {
      return
    }

    this.attributeService.GetAttributes().subscribe(
      (attributes: Attribute[]) => {
        this.attributeList = attributes
        this.attributeListGet = true
      }
    )
  }

  private findAttribute(id: string): Attribute | undefined {
    return this.attributeList.find((a: Attribute) => a._id === id)
  }

  private getFloorList(): void {
    this.floorService.GetFloors().subscribe(
      (floors: Floors[]) => {
        this.floorList = floors
        this.floorListGet = true
      }
    )
  }

  private findFloor(id: string): string {
    const floor = this.floorList.find((f: Floors) => f._id === id)
    return floor?.name || 'Unknown Floor'
  }

  trackLog(_index: number, log: Log): string {
    return log._id || _index.toString()
  }

  ngOnDestroy(): void {
    if (this.componentLogSubscription) {
      this.componentLogSubscription.unsubscribe()
    }

    if (this.logsByIdSubscription) {
      this.logsByIdSubscription.unsubscribe()
    }
  }
}
