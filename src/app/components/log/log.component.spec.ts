import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { NgxPaginationModule } from 'ngx-pagination'
import { LogComponent } from './log.component'

describe('LogComponent', () => {
  let component: LogComponent
  let fixture: ComponentFixture<LogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogComponent],
      imports: [HttpClientModule, NgxPaginationModule],
    }).compileComponents()

    fixture = TestBed.createComponent(LogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
