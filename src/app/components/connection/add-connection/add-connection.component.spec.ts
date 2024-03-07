import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ConnectionAddComponent} from './add-connection.component'

describe('ConnectionAddComponent', () => {
  let component: ConnectionAddComponent
  let fixture: ComponentFixture<ConnectionAddComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionAddComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ConnectionAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
