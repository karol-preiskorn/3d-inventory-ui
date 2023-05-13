import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { DevicesListComponent } from './devices-list.component'

describe('DevicesListComponent', () => {
  let component: DevicesListComponent
  let fixture: ComponentFixture<DevicesListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevicesListComponent, HttpClientModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DevicesListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
