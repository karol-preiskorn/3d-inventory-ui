import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { FloorService } from '../../../services/floor.service'
import { LogService } from '../../../services/log.service'
import { Floor } from '../../../shared/floor'

@Component({
  selector: 'app-floor-list',
  templateUrl: './floor-list.component.html',
  styleUrls: ['./floor-list.component.scss'],
})
export class FloorListComponent implements OnInit {
  floorList: Floor[] = []
  selectedFloor: Floor
  component: string = 'Floors'
  floorListPage: number = 1

  ngOnInit() {
    this.loadFloors()
  }

  constructor(
    private floorService: FloorService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  loadFloors() {
    return this.floorService.GetFloors().subscribe((data: Floor[]) => {
      this.floorList = data
    })
  }

  deleteFloor(id: string) {
    const idString = id // Convert ObjectId to string
    this.logService.CreateLog({
      message: { id: idString },
      objectId: idString,
      operation: 'Delete',
      component: this.component,
    })
    return this.floorService.DeleteFloor(idString).subscribe((data: Floor) => {
      console.log(data)
      this.loadFloors()
      this.router.navigate(['/floor-list/'])
    })
  }

  cloneFloor(id: string) {
    const id_new: string = this.floorService.CloneFloor(id)
    this.logService
      .CreateLog({
        message: { id: id, id_new: id_new },
        operation: 'Clone',
        component: this.component,
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
      })
    this.loadFloors()
  }

  addFloor() {
    this.router.navigateByUrl('add-floor')
  }

  editFloor(floor: Floor) {
    this.selectedFloor = floor
    this.router.navigate(['edit-floor/', floor._id])
  }
}
