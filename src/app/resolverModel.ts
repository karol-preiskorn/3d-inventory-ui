import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { ModelsService } from './services/models.service';
import { Model } from './shared/model';

@Injectable({
  providedIn: 'root', // This ensures it is available application-wide
})
export class ResolverModel implements Resolve<Observable<Model[]>> {
  constructor(private modelsService: ModelsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Model[]> {
    console.log('ResolverModel')
    return this.modelsService.GetModels()
  }
}
