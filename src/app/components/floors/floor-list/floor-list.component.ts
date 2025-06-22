import { CommonModule } from '@angular/common'
import { Component, NgZone, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

import { FloorService } from '../../../services/floor.service'
import { LogService } from '../../../services/log.service'
import { Floors } from '../../../shared/floors'
import { LogComponent } from '../../log/log.component'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-floor-list',
  templateUrl: './floor-list.component.html',
  styleUrls: ['./floor-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, LogComponent],
})
export class FloorListComponent implements OnInit, OnDestroy {
  floorList: Floors[] = []
  selectedFloor: Floors
  component: string = 'floors'
  componentName: string = 'Floor'
  pageSize: number = 5 // Number of items per page
  totalItems: number = 0 // Total number of items
  page: number = 1 // Current page number
  floorListPage: number = 1

  private unsubscribe$ = new Subject<void>()

  ngOnInit() {
    this.loadFloors()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
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
    this.floorService
      .GetFloors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Floors[]) => {
        this.floorList = data
      })
  }

  deleteFloor(id: string) {
    console.info('[deleteFloor] delete floor:', id || 'undefined')
    this.logService
      .CreateLog({
        message: { id },
        objectId: id,
        operation: 'Delete',
        component: this.component,
      })
      .subscribe({
        next: () => {
          // Log created successfully, proceed to delete
          this.floorService.DeleteFloor(id).subscribe({
            next: () => {
              // Remove the deleted floor from the list in place
              this.floorList = this.floorList.filter((floor) => floor._id !== id)
            },
            error: (err) => {
              console.error('[deleteFloor] Failed to delete floor:', err)
            },
            complete: () => {
              // Optionally, you can call this.loadFloors() here if you want to refresh from backend
              this.loadFloors()
              console.log('[deleteFloor] Floor deleted successfully:', id)
            },
          })
        },
        error: (logError) => {
          console.error('[deleteFloor] Error creating log:', logError)
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
