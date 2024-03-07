import {ComponentFixture, TestBed} from '@angular/core/testing'

import {FloorAddComponent} from './add-floor.component'

describe('FloorAddComponent', () => {
  let component: FloorAddComponent
  let fixture: ComponentFixture<FloorAddComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorAddComponent],
    })
    fixture = TestBed.createComponent(FloorAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
