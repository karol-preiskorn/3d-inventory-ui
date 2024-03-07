import {ComponentFixture, TestBed} from '@angular/core/testing'
import {HttpClientModule} from '@angular/common/http'
import {DeviceListComponent} from './device-list.component'
import {NgxPaginationModule} from 'ngx-pagination'
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'

describe('DeviceListComponent', () => {
  let component: DeviceListComponent
  let fixture: ComponentFixture<DeviceListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, NgxPaginationModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
