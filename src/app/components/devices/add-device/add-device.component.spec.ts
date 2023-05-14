import { HttpClientModule } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { LogComponent } from '../../log/log.component'
import { AddDeviceComponent } from './add-device.component'
describe('AddDeviceComponent', () => {
  let component: AddDeviceComponent
  let fixture: ComponentFixture<AddDeviceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDeviceComponent, LogComponent],
      imports: [HttpClientModule, NgxPaginationModule, ReactiveFormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(AddDeviceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
