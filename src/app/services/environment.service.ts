/*
 * File:        @/src/app/services/environment.service.ts
 * @description:
 * @usedBy
 * Dependency:
 *
 * Date        By       Comments
 * ----------  -------  ------------------------------
 * 2023-08-03  C2RLO
 */

import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  // TODO: create json database entity with application settings and api settings values
  private settings = [
    {
      name: 'BASEURL',
      value: 'http://localhost:3000',
    },
  ]

/**
 * @description dictionary all application component to show components logs
 *              or object logs.
 *              - component:
 *              - api:
 * @private
 * @memberof EnvironmentService
 */
private api = [
    { component: 'Models', api: 'models' },
    { component: 'Devices', api: 'devices' },
    { component: 'Logs', api: 'logs' },
    { component: 'Attributes', api: 'attributes' },
    { component: 'Attribute Dictionary', api: 'attribute-dictionary' },
    { component: 'Connection', api: 'connections' },
    { component: 'Floor', api: 'floor' },
  ]

  getSettings(name: string): string | undefined {
    return this.settings.find((e) => e.name === name)?.value
  }

  getApiSettings(component: string): string | undefined {
    return this.api.find((e) => e.component === component)?.api
  }

  isApiSettings(component: string): boolean {
    return this.api.find((e) => e.component === component) ? true : false
  }
}
