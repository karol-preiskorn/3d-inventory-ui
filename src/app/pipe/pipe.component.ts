import { interval, Observable, Observer } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'async-observable-pipe',
  template: '<div><code>observable|async</code>: Time: {{ time | async }}</div>',
})
export class AsyncObservablePipeComponent {
  time = interval(1000)
}
