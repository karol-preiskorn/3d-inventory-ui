import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { DeviceEditComponent } from './edit-device.component'
import { HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('DeviceEditComponent', () => {
  let component: DeviceEditComponent
  let fixture: ComponentFixture<DeviceEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceEditComponent],
      imports: [RouterTestingModule, HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
