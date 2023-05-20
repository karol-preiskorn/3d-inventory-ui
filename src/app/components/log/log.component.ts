import { Component, OnInit, Input, OnChanges } from '@angular/core'
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
  p = 1
  hideWhenNoLog = false
  noData = false
  preLoader = false
  private sub: any
  constructor(public logService: LogService) {}
  ngOnInit() {
    if (this.component == 'Model' || this.component == 'Device') {
      this.loadComponentLog(this.component)
    } else {
      this.loadObjectsLog(this.component)
    }
  }
  ngOnChanges() {
    console.log('LogComponent.ngOnChanges: ' + this.component)
    if (this.component == 'Model' || this.component == 'Device') {
      this.loadComponentLog(this.component)
    } else {
      this.loadObjectsLog(this.component)
    }
  }
  // ngOnDestroy(): void {
  //   this.sub.ngUnsubscribe()
  // }
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
