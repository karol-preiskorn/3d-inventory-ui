/**
 * @file /src/app/components/connection/edit-connection/edit-connection.component.ts
 * @module /src/app/components/connection/edit-connection
 * @description This file contains the ConnectionEditComponent class, which provides methods for editing a connection.
 * @version 2024-03-17 C2RLO - Initial new unified version
 **/

import { ObjectId } from 'mongodb'
import { Observable, tap } from 'rxjs'
import { ConnectionService } from 'src/app/services/connection.service'
import { DeviceService } from 'src/app/services/device.service'
import { LogService } from 'src/app/services/log.service'
import { ComponentDictionary } from 'src/app/shared/component-dictionary'
import { Connection } from 'src/app/shared/connection'
import { Device } from 'src/app/shared/device'

import { Component, NgZone, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss'],
})
export class ConnectionEditComponent implements OnInit {
  inputId: ObjectId
  form = this.createFormGroup()

  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component: ObjectId | string

  ngOnInit() {
    this.createFormGroup()
    this.getDeviceList()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') as unknown as ObjectId
    this.getConnection(this.inputId).subscribe((data: Connection) => {
      this.connection = data
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
    return this.formBuilder.group({
      id: [new ObjectId(), Validators.required],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      deviceIdTo: [new ObjectId(), [Validators.required]],
      deviceIdFrom: [new ObjectId(), [Validators.required]],
    })
  }

  changeId(e: Event) {
    if (this.id) {
      const value = (e.target as HTMLInputElement).value
      const objectId = new ObjectId(value)
      this.id.setValue(objectId, { onlySelf: true })
    }
  }
  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }

  changeDeviceFrom(e: Event) {
    const value = (e.target as HTMLInputElement).value
    const objectId = new ObjectId(value)
    this.deviceIdFrom?.setValue(objectId, { onlySelf: true })
  }

  changeDeviceTo(e: Event) {
    const value = (e.target as HTMLInputElement).value
    const objectId = new ObjectId(value)
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

  private getConnection(id: ObjectId): Observable<Connection> {
    return this.connectionService.GetConnection(this.inputId).pipe(
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
          objectId: this.form.get('id')?.value as unknown as ObjectId,
          message: { value: this.form.value },
          operation: 'Update',
          component: 'Connection',
        })
        .subscribe(() => {
          this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
          this.router.navigate(['connection-list'])
        })
    })
  }
}
