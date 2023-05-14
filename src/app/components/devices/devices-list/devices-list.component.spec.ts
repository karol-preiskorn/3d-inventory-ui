import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { DevicesListComponent } from './devices-list.component'
import { NgxPaginationModule } from 'ngx-pagination'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DevicesListComponent', () => {
  let component: DevicesListComponent
  let fixture: ComponentFixture<DevicesListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevicesListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, NgxPaginationModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DevicesListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
