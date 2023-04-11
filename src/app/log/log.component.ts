import { Component, OnInit } from '@angular/core'
import { Log, LogService } from '../services/log.service'

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {
  LogList: Log[] = []

  p = 1
  hideWhenNoLog = false
  noData = false
  preLoader = false

  constructor(public logService: LogService) {}

  ngOnInit() {
    this.loadLog()
  }

  loadLog() {
    return this.logService.GetLogs().subscribe((data: any) => {
      // data.sort(function (a: any, b: any) {
      //   if (a.date < b.date) return -1
      //   if (a.date > b.date) return 1
      //   return 0
      // })
      this.LogList = data
    })
  }
}
