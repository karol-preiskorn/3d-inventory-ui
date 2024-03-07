import {Component, NgZone, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {v4 as uuidv4} from 'uuid'

import {Device} from 'src/app/shared/device'
import {DeviceService} from 'src/app/services/device.service'

import {Connection} from 'src/app/shared/connection'
import {ConnectionService} from 'src/app/services/connection.service'

import {ComponentDictionary} from 'src/app/shared/component-dictionary'
import {LogService} from 'src/app/services/log.service'
import {Observable, tap} from 'rxjs'

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss'],
})
export class ConnectionEditComponent implements OnInit {
  inputId: string

  editConnectionForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(36)]),
    name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    deviceIdTo: new FormControl('', Validators.required),
    deviceIdFrom: new FormControl('', Validators.required),
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
    private logService: LogService
  ) {}

  formConnection() {
    this.editConnectionForm = this.formBulider.group({
      id: [uuidv4(), [Validators.required, Validators.minLength(36)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      deviceIdTo: ['', [Validators.required]],
      deviceIdFrom: ['', [Validators.required]],
    })
  }

  changeId(e: Event) {
    this.id?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeName(e: Event) {
    this.name?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }
  changeDeviceFrom(e: Event) {
    this.deviceIdFrom?.setValue((e.target as HTMLInputElement).value, {onlySelf: true})
  }

  get id() {
    return this.editConnectionForm.get('id')
  }
  get name() {
    return this.editConnectionForm.get('name')
  }
  get deviceIdTo() {
    return this.editConnectionForm.get('deviceIdTo')
  }
  get deviceIdFrom() {
    return this.editConnectionForm.get('deviceIdFrom')
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
          'ConnectionEditComponent.connectionService.GetConnection(' + id + ') => ' + JSON.stringify(data, null, ' ')
        )
        this.connection = data
        this.editConnectionForm.setValue({
          id: data._id,
          name: data.name,
          deviceIdTo: data.deviceIdTo,
          deviceIdFrom: data.deviceIdFrom,
        })
      })
    )
  }

  submitForm() {
    this.connectionService.UpdateConnection(this.inputId, this.editConnectionForm.value as Connection).subscribe(() => {
      this.logService
        .CreateLog({
          objectId: this.editConnectionForm.get('id')?.value,
          message: this.toString(this.editConnectionForm.value),
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
