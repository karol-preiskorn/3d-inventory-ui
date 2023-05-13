import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { AddDeviceComponent } from './add-device.component'

describe('AddDeviceComponent', () => {
  let component: AddDeviceComponent
  let fixture: ComponentFixture<AddDeviceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDeviceComponent, HttpClientModule],
    }).compileComponents()

    fixture = TestBed.createComponent(AddDeviceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
