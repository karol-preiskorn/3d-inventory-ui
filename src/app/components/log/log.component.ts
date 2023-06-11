import { Component, OnInit, Input } from '@angular/core'
import { Subscription } from 'rxjs'
import { Log, LogService } from 'src/app/services/log.service'

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {
  LogList: Log[] = []
  @Input() component = ''
  pageLog = 1
  hideWhenNoLog = false
  noData = false
  preLoader = false
  private sub: any
  constructor(public logService: LogService) {}
  ngOnInit() {
    if (this.component == 'Model' || this.component == 'Device' || this.component == 'Attribute Dictionary' || this.component == 'Connection') {
      // load list context
      this.loadComponentLog(this.component)
    } else {
      // load id context
      this.loadObjectsLog(this.component)
    }
  }
  ngOnChanges() {
    console.log('LogComponent.ngOnChanges: ' + this.component)
    if (this.component == 'Model' || this.component == 'Device' || this.component == 'Attribute Dictionary' || this.component == 'Connection') {
      this.loadComponentLog(this.component)
    } else {
      this.loadObjectsLog(this.component)
    }
  }
  loadComponentLog(id: string): Subscription {
    return this.logService
      .GetComponentLogs(this.component)
      .subscribe((data: Log[]) => {
        console.log('loadComponentLog(' + id + '): ' + JSON.stringify(data))
        this.LogList = data
      })
  }
  loadObjectsLog(id: string): Subscription {
    return this.logService
      .GetObjectsLogs(this.component)
      .subscribe((data: Log[]) => {
        console.log('loadObjectsLog(' + id + '): ' + JSON.stringify(data))
        this.LogList = data
      })
  }
}
