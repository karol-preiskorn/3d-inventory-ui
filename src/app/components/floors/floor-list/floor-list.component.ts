import { CommonModule } from '@angular/common'
import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { FloorService } from '../../../services/floor.service'
import { LogService } from '../../../services/log.service'
import { Floors } from '../../../shared/floors'
import { LogComponent } from '../../log/log.component'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-floor-list',
  templateUrl: './floor-list.component.html',
  styleUrls: ['./floor-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, LogComponent],
})
export class FloorListComponent implements OnInit {
  floorList: Floors[] = []
  selectedFloor: Floors
  component: string = 'floors'
  componentName: string = 'Floor'
  pageSize: number = 5 // Number of items per page
  totalItems: number = 0 // Total number of items
  page: number = 1 // Current page number
  floorListPage: number = 1

  ngOnInit() {
    this.loadFloors()
  }

  onPageChange(page: number): void {
    this.floorListPage = page
  }
  onPageSizeChange(pageSize: number): void {
    this.floorListPage = pageSize
  }

  constructor(
    private readonly floorService: FloorService,
    private readonly logService: LogService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {}

  loadFloors() {
    return this.floorService.GetFloors().subscribe((data: Floors[]) => {
      this.floorList = data
    })
  }

  deleteFloor(id: string) {
    const idString = id
    console.error('[deleteFloor] delete floor:', idString || 'undefined')
    try {
      this.logService.CreateLog({
        message: { id },
        objectId: id,
        operation: 'Delete',
        component: this.component,
      })
    } catch (logError) {
      console.error('[deleteFloor] Error creating log:', logError)
      return
    }
    this.floorService.DeleteFloor(idString).subscribe({
      next: () => {
        this.ngZone.run(() => this.router.navigateByUrl('floor-list'))
      },
      error: (err) => {
        console.error('[deleteFloor] Failed to delete floor:', err)
      },
      complete: () => {
        this.loadFloors()
      },
    })
  }

  cloneFloor(id: string) {
    this.floorService.CloneFloor(id).subscribe((id_new: string) => {
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
    })
  }

  addFloor() {
    this.router.navigateByUrl('add-floor')
  }

  editFloor(floor: Floors) {
    this.selectedFloor = floor
    this.router.navigate(['edit-floor/', floor._id])
  }
}
