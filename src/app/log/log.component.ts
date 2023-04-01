import { Component } from '@angular/core'
import { LogService } from '../services/log.service'

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent {
  constructor(public logService: LogService) {}
}
