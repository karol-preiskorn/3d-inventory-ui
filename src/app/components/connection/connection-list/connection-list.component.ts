import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ConnectionService } from 'src/app/services/connection.service'
import { LogService } from 'src/app/services/log.service'
import { Connection } from 'src/app/shared/connection'

@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss']
})
export class ConnectionListComponent implements OnInit {
  connectionList: Connection[] = []
  selectedConnection: Connection
  connectionListPage = 1
  component = 'Connection'

  ngOnInit() {
    this.loadConnection()
  }

  constructor(
    public ConnectionService: ConnectionService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  loadConnection() {
    return this.ConnectionService
      .GetConnections()
      .subscribe((data: any) => {
        this.connectionList = data
      })
  }
  deleteConnection(id: string) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: 'Connection',
    })
    return this.ConnectionService
      .DeleteConnection(id)
      .subscribe((data: any) => {
        console.log(data)
        this.loadConnection()
        this.router.navigate(['/connection-list'])
      })
  }
  async CloneConnection(id: string) {
    const id_new: string =
      this.ConnectionService.CloneConnection(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: 'Connection',
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('connection-list'))
      })
    // this.loadConnection()
    // this.router.navigate(['/attribute-dictionary-list'])
  }
  AddForm() {
    this.router.navigateByUrl('add-connection')
  }
  EditForm(Connection: Connection) {
    this.selectedConnection = Connection
    this.router.navigate(['edit-connection', this.selectedConnection.id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
