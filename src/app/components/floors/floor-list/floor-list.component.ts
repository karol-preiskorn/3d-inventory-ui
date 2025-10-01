import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { DebugService } from '../../../services/debug.service'
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private readonly debugService: DebugService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  loadFloors() {
    this.debugService.info('[loadFloors] Loading floors...')
    this.floorService
      .GetFloors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Floors[]) => {
          this.debugService.info('[loadFloors] Floors loaded successfully:', data.length)
          this.floorList = data
          this.cdr.detectChanges()
        },
        error: (error) => {
          this.debugService.error('[loadFloors] Error loading floors:', error)
        }
      })
  }

  deleteFloor(id: string) {
    this.debugService.info('[deleteFloor] delete floor:', id || 'undefined');
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
              this.debugService.info('[deleteFloor] Floor deleted successfully:', id);
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
