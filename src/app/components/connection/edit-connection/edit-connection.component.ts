/**
 * @description This file contains the ConnectionEditComponent class, which provides methods for editing a connection.
 * @version 2024-03-17 C2RLO - Initial new unified version
 **/

import { Observable, Subscription, tap } from 'rxjs'

import { Component, NgZone, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { ConnectionService } from '../../../services/connection.service'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ComponentDictionary } from '../../../shared/component-dictionary'
import { Connection } from '../../../shared/connection'
import { Device } from '../../../shared/device'

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss'],
})
export class ConnectionEditComponent implements OnInit {
  inputId: string
  form = this.createFormGroup()
  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component: string

  ngOnInit() {
    this.getDeviceList()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
    this.getConnection(this.inputId).subscribe((data: Connection) => {
      this.connection = data
      this.component = this.inputId
      this.form = this.createFormGroup()
      console.log('ConnectionEditComponent.ngOnInit() => ' + JSON.stringify(this.connection, null, ' '))
      this.form.patchValue({
        _id: this.connection._id,
        name: this.connection.name,
        deviceIdTo: this.connection.deviceIdTo,
        deviceIdFrom: this.connection.deviceIdFrom,
      })
    })
    this.component = this.inputId
  }

  constructor(
    public formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService,
  ) {}

  createFormGroup() {
    return new FormGroup({
      _id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      deviceIdTo: new FormControl('', [Validators.required]),
      deviceIdFrom: new FormControl('', [Validators.required]),
    })
  }

  changeId(e: Event) {
    if (this.id) {
      const value = (e.target as HTMLInputElement).value
      const objectId = value as never
      this.id.setValue(objectId, { onlySelf: true })
    }
  }

  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDeviceFrom(e: Event) {
    const value = (e.target as HTMLInputElement).value
    const objectId = value
    this.deviceIdFrom?.setValue(objectId, { onlySelf: true })
  }

  changeDeviceTo(e: Event) {
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
    })
  }

  private getConnection(id: string): Observable<Connection> {
    return this.connectionService.GetConnection(id).pipe(
      tap((data: Connection) => {
        console.log(
          'ConnectionEditComponent.connectionService.GetConnection(' + id + ') => ' + JSON.stringify(data, null, ' '),
        )
        this.connection = data
      }),
    )
  }

  submitForm() {
    this.connectionService.UpdateConnection(this.inputId, this.form.value as unknown as Connection).subscribe(() => {
      this.logService
        .CreateLog({
          component: 'Connection',
          objectId: this.form.value._id as string,
          operation: 'Update',
          message: { value: this.form.value },
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
          this.router.navigate(['connection-list'])
        })
    })
  }
}
