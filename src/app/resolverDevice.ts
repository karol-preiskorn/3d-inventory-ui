import { Observable } from 'rxjs'

import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'

import { DeviceService } from './services/device.service'
import { Device } from './shared/device'

@Injectable()
export class ResolverDevice implements Resolve<Observable<Device[]>> {
  constructor(private api: DeviceService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Device[]> {
    console.log('Resolver')
    return this.api.GetDevices()
  }
}
