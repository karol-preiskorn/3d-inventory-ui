import { HttpClientModule } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { LogComponent } from '../../log/log.component'
import { DeviceAddComponent } from './add-device.component'
describe('DeviceAddComponent', () => {
  let component: DeviceAddComponent
  let fixture: ComponentFixture<DeviceAddComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceAddComponent, LogComponent],
      imports: [HttpClientModule, NgxPaginationModule, ReactiveFormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
