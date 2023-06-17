import { Component, OnInit, Input } from '@angular/core'
import { Subscription } from 'rxjs'
import { Log, LogService } from 'src/app/services/log.service'
import { EnvironmentService } from 'src/app/services/environment.service'

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
  constructor(public logService: LogService, private environmentService: EnvironmentService) {}
  loadLog(context: string) {
    console.log(this.environmentService.isApiSettings(this.component))
    if (this.environmentService.isApiSettings(this.component)) {
      console.log(context + '.loadComponentLog: ' + this.component)
      this.loadComponentLog(this.component)
    } else {
      console.log(context + '.loadObjectLog: ' + this.component)
      this.loadObjectsLog(this.component)
    }
  }
  ngOnInit() {
    this.loadLog('ngOnInit')
  }
  ngOnChanges() {
    this.loadLog('ngOnChanges')
  }
  loadComponentLog(id: string): Subscription {
    return this.logService.GetComponentLogs(id).subscribe((data: Log[]) => {
      console.log('LogComponent.loadComponentLog(' + id + '): ' + JSON.stringify(data))
      this.LogList = data
    })
  }
  loadObjectsLog(id: string): Subscription {
    return this.logService.GetObjectsLogs(id).subscribe((data: Log[]) => {
      console.log('LogComponent.loadObjectsLog(' + id + '): ' + JSON.stringify(data))
      this.LogList = data
    })
  }
}
