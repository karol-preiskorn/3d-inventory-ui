import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { EditDeviceComponent } from './edit-device.component'
import { HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('EditDeviceComponent', () => {
  let component: EditDeviceComponent
  let fixture: ComponentFixture<EditDeviceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeviceComponent],
      imports: [RouterTestingModule, HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(EditDeviceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
