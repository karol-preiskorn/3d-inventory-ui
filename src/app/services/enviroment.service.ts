import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class EnviromentService {
  private data = [{
    name: "BASEURL", value: "http://localhost:3000"
  }];

  get(name: string) {
    return this.data.find((e) => e.name === name)
  }
}