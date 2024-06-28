/**
 * @file /src/app/components/connection/edit-connection/edit-connection.component.ts
 * @module /src/app/components/connection/edit-connection
 * @description This file contains the ConnectionEditComponent class, which provides methods for editing a connection.
 * @version 2024-03-17 C2RLO - Initial new unified version
 **/

import { ObjectId } from 'mongodb';
import { Observable, tap } from 'rxjs';
import { ConnectionService } from 'src/app/services/connection.service';
import { DeviceService } from 'src/app/services/device.service';
import { LogService } from 'src/app/services/log.service';
import { ComponentDictionary } from 'src/app/shared/component-dictionary';
import { Connection } from 'src/app/shared/connection';
import { Device } from 'src/app/shared/device';

import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss'],
})
export class ConnectionEditComponent implements OnInit {
  inputId: string
  form = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    deviceIdTo: new FormControl(ObjectId, Validators.required),
    deviceIdFrom: new FormControl(ObjectId, Validators.required),
  })
  connection: Connection = new Connection()
  deviceList: Device[]
  isSubmitted = false
  componentDictionary: ComponentDictionary = new ComponentDictionary()
  component = ''
  ngOnInit() {
    this.formConnection()
    this.getDeviceList()
    this.inputId = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
    this.getConnection(this.inputId).subscribe((data: Connection) => {
      this.connection = data
    })
    this.component = this.inputId
  }

  constructor(
    public formBulider: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private deviceService: DeviceService,
    private logService: LogService,
  ) {}
  formConnection() {
    this.form = this.formBulider.group({
      id: ['', [Validators.required, Validators.minLength(24)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      deviceIdTo: ['', [Validators.required]],
      deviceIdFrom: ['', [Validators.required]],
    })
  }
  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }
  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }
  changeDeviceFrom(e: Event) {
    this.deviceIdFrom?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
  }
  changeDeviceTo(e: Event) {
    this.deviceIdTo?.setValue((e.target as HTMLInputElement).value, { onlySelf: true })
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
    return this.connectionService.GetConnection(this.inputId).pipe(
      tap((data: Connection) => {
        console.log(
          'ConnectionEditComponent.connectionService.GetConnection(' + id + ') => ' + JSON.stringify(data, null, ' '),
        )
        this.connection = data
        this.form.setValue({
          id: data._id,
          name: data.name,
          deviceIdTo: data.deviceIdTo,
          deviceIdFrom: data.deviceIdFrom,
        })
      }),
    )
  }
  submitForm() {
    this.connectionService.UpdateConnection(this.inputId, this.form.value as Connection).subscribe(() => {
      this.logService
        .CreateLog({
          objectId: this.form.get('id')?.value,
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
