import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FloorService } from 'src/app/services/floor.service'
import { LogService } from 'src/app/services/log.service'
import { Floor } from 'src/app/shared/floor'

@Component({
  selector: 'app-floor-list',
  templateUrl: './floor-list.component.html',
  styleUrls: ['./floor-list.component.scss'],
})
export class FloorListComponent implements OnInit {
  floorList: Floor[] = []
  selectedFloor: Floor
  component = 'Floor'
  floorListPage = 1

  ngOnInit() {
    this.loadFloors()
  }

  constructor(
    private floorService: FloorService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  loadFloors() {
    return this.floorService.GetFloors().subscribe((data: Floor[]) => {
      this.floorList = data
    })
  }

  deleteFloor(id: string) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: this.component,
    })
    return this.floorService.DeleteFloor(id).subscribe((data: Floor) => {
      console.log(data)
      this.loadFloors()
      this.router.navigate(['/floor-list/'])
    })
  }

  cloneFloor(id: string) {
    const id_new: string = this.floorService.CloneFloor(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
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
    this.router.navigate(['edit-floor/', floor.id])
  }
}
