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

  p = 1
  hideWhenNoLog = false
  noData = false
  preLoader = false

  constructor(public logService: LogService) {}

  ngOnInit() {
    this.loadComponentLog(this.component)
  }
  loadComponentLog(id: string): Subscription {
    return this.logService
      .GetComponentLogs(this.component)
      .subscribe((data: Log[]) => {
        console.log('id: ' + data)
        this.LogList = data
      })
  }
}
