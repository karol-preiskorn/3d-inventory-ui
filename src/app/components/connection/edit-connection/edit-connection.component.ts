/**
 * @description This file contains the ConnectionEditComponent class, which provides methods for editing a connection.
 * @version 2024-03-17 C2RLO - Initial new unified version
 **/

import { firstValueFrom, Observable, tap } from 'rxjs'
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { ConnectionService } from '../../../services/connection.service'
import { DebugService } from '../../../services/debug.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { AttributeDictionaryService } from '../../../services/attribute-dictionary.service'
import { ComponentDictionary } from '../../../shared/ComponentDictionary'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'
import { AttributesDictionary } from '../../../shared/AttributesDictionary'
import { CommonModule } from '@angular/common'
import { LogComponent } from '../../log/log.component'

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule, LogComponent],
})
export class ConnectionEditComponent implements OnInit {
  inputId: string
  form: FormGroup
  connection: Connection
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component: string
  attributesDictionary: AttributesDictionary[] = []
  deviceFrom: Device | null = null
  deviceTo: Device | null = null

  constructor(
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService,
    private debugService: DebugService,
    private attributeDictionaryService: AttributeDictionaryService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.createFormGroup()
  }

  ngOnInit() {
    this.getDeviceList()
    this.getAttributesDictionary()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
    this.getConnection(this.inputId).subscribe((data: Connection) => {
      this.connection = data
      this.component = this.inputId
      this.form = this.createFormGroup()
      this.debugService.lifecycle('ConnectionEditComponent', 'ngOnInit', this.connection)
      this.form.patchValue({
        _id: this.connection._id,
        name: this.connection.name,
        deviceIdTo: this.connection.deviceIdTo,
        deviceIdFrom: this.connection.deviceIdFrom,
      })
      // Load detailed device information
      this.loadDeviceDetails()
      this.cdr.detectChanges()
    })
    this.component = this.inputId
    this.connection = new Connection()
  }

  createFormGroup = () => {
    return new FormGroup({
      _id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      deviceIdTo: new FormControl('', [Validators.required]),
      deviceIdFrom: new FormControl('', [Validators.required]),
    })
  }

  changeId = (e: Event): void => {
    if (this.id) {
      const value = (e.target as HTMLInputElement).value
      const objectId = value as never
      this.id.setValue(objectId, { onlySelf: true })
    }
  }

  changeName = (e: Event): void => {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDeviceFrom = (e: Event): void => {
    const value = (e.target as HTMLInputElement).value
    const objectId = value
    this.deviceIdFrom?.setValue(objectId, { onlySelf: true })
  }

  changeDeviceTo = (e: Event): void => {
    const value = (e.target as HTMLInputElement).value
    const objectId = value
    this.deviceIdTo?.setValue(objectId, { onlySelf: true })
  }

  get id() {
    return this.form.get('id')
  }

  get name() {
    return this.form.get('name')
  }

  get deviceIdTo() {
    return this.form.get('deviceIdTo')
  }

  get deviceIdFrom() {
    return this.form.get('deviceIdFrom')
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }

  toString(data: unknown): string {
    return JSON.stringify(data, null, 2)
  }

  getDeviceList() {
    return this.deviceService.GetDevices().subscribe((data: Device[]) => {
      const tmp = new Device()
      data.unshift(tmp)
      this.deviceList = data
      this.cdr.detectChanges()
    })
  }

  private getConnection(id: string): Observable<Connection> {
    return this.connectionService.GetConnection(id).pipe(
      tap((data: Connection) => {
        this.debugService.api('GET', `/connections/${id}`, data)
        this.connection = data
      }),
    )
  }

  getAttributesDictionary() {
    this.attributeDictionaryService.GetAttributeDictionaries().subscribe((data: AttributesDictionary[]) => {
      this.attributesDictionary = data
      this.debugService.api('GET', '/attributes-dictionary', data)
      this.cdr.detectChanges()
    })
  }

  loadDeviceDetails() {
    if (this.connection.deviceIdFrom) {
      this.deviceService.getDeviceSynchronize(this.connection.deviceIdFrom).subscribe((device: Device) => {
        this.deviceFrom = device
        this.debugService.api('GET', `/devices/${this.connection.deviceIdFrom}`, device)
        this.cdr.detectChanges()
      })
    }

    if (this.connection.deviceIdTo) {
      this.deviceService.getDeviceSynchronize(this.connection.deviceIdTo).subscribe((device: Device) => {
        this.deviceTo = device
        this.debugService.api('GET', `/devices/${this.connection.deviceIdTo}`, device)
        this.cdr.detectChanges()
      })
    }
  }  getAttributeForDevice(device: Device | null, attributeKey: string): string {
    if (!device || !device.attributes) {
      return 'N/A'
    }
    const attribute = device.attributes.find(attr => attr.key === attributeKey)
    return attribute ? attribute.value : 'N/A'
  }

  getAttributeDictionaryName(attributeName: string): string {
    const attrDict = this.attributesDictionary.find(dict => dict.name === attributeName)
    return attrDict ? attrDict.name : attributeName
  }

  debugConnectionData() {
    console.warn('=== Connection Debug Info ===')
    console.warn('Connection:', JSON.stringify(this.connection, null, 2))
    console.warn('Device From:', JSON.stringify(this.deviceFrom, null, 2))
    console.warn('Device To:', JSON.stringify(this.deviceTo, null, 2))
    console.warn('Attributes Dictionary:', JSON.stringify(this.attributesDictionary, null, 2))
    console.warn('Form Value:', JSON.stringify(this.form.value, null, 2))
    console.warn('Form Valid:', this.form.valid)
    this.debugService.api('DEBUG', 'Connection Edit Debug', {
      connection: this.connection,
      deviceFrom: this.deviceFrom,
      deviceTo: this.deviceTo,
      attributesDictionary: this.attributesDictionary,
      formValue: this.form.value,
      formValid: this.form.valid
    })
  }

  testUpdateAPI() {
    console.warn('=== Testing Update API ===')
    const testData = {
      name: `${this.connection.name}-api-test-${Date.now()}`,
      deviceIdFrom: this.connection.deviceIdFrom,
      deviceIdTo: this.connection.deviceIdTo
    }
    console.warn('Test Data:', JSON.stringify(testData, null, 2))

    this.connectionService.UpdateConnection(this.inputId, testData as Connection).subscribe({
      next: (result) => {
        console.warn('API Test Success:', JSON.stringify(result, null, 2))

        // Create a log entry for this test
        this.logService.CreateLog({
          component: 'connections',
          objectId: this.inputId,
          operation: 'Test Update',
          message: JSON.stringify({ testData, result, timestamp: new Date().toISOString() })
        }).subscribe({
          next: (logResult) => {
            console.warn('Test Log Created:', JSON.stringify(logResult, null, 2))
          },
          error: (logError) => {
            console.error('Error creating test log:', logError)
          }
        })

        // Reload the connection to see the update
        this.getConnection(this.inputId).subscribe((data: Connection) => {
          this.connection = data
          this.form.patchValue({
            _id: this.connection._id,
            name: this.connection.name,
            deviceIdTo: this.connection.deviceIdTo,
            deviceIdFrom: this.connection.deviceIdFrom,
          })
          this.cdr.detectChanges()
        })
      },
      error: (error) => {
        console.error('API Test Error:', error)

        // Create a log entry for the error
        this.logService.CreateLog({
          component: 'connections',
          objectId: this.inputId,
          operation: 'Test Update Error',
          message: JSON.stringify({ error: error.message || error, timestamp: new Date().toISOString() })
        }).subscribe()
      }
    })
  }

  testLogCreation() {
    console.warn('=== Testing Log Creation ===')
    const testLogData = {
      component: 'connections',
      objectId: this.inputId,
      operation: 'Debug Test',
      message: JSON.stringify({
        connection: this.connection,
        deviceFrom: this.deviceFrom,
        deviceTo: this.deviceTo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    }

    this.logService.CreateLog(testLogData).subscribe({
      next: (result) => {
        console.warn('✅ Test Log Created Successfully:', JSON.stringify(result, null, 2))
        // Force the log component to refresh by calling a direct refresh if needed
        window.location.reload()
      },
      error: (error) => {
        console.error('❌ Test Log Creation Failed:', error)
      }
    })
  }

  async submitForm() {
    try {
      console.warn('=== Submitting Connection Form ===')
      console.warn('Form Value:', JSON.stringify(this.form.value, null, 2))
      console.warn('Input ID:', this.inputId)
      console.warn('Form Valid:', this.form.valid)

      const formValue = this.form.value as Connection

      // Update the connection
      const updateResult = await firstValueFrom(this.connectionService.UpdateConnection(this.inputId, formValue))
      console.warn('Update Result:', JSON.stringify(updateResult, null, 2))

      // Log the operation
      await firstValueFrom(
        this.logService.CreateLog({
          component: 'connections',
          objectId: formValue._id,
          operation: 'Update',
          message: JSON.stringify({
            id: formValue._id,
            name: formValue.name,
            deviceIdTo: formValue.deviceIdTo,
            deviceIdFrom: formValue.deviceIdFrom,
            action: 'Update connection'
          }),
        }),
      )

      console.warn('Form submission successful, navigating to connection list')
      await this.ngZone.run(() => this.router.navigateByUrl('connection-list')).catch(() => {})
      await this.router.navigate(['connection-list']).catch(() => {})
    } catch (error) {
      console.error('Error submitting form:', error)
      // Don't navigate on error
    }
  }
}
