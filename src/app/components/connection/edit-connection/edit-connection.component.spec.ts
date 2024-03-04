import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConnectionEditComponent } from './edit-connection.component'

describe('ConnectionEditComponent', () => {
  let component: ConnectionEditComponent
  let fixture: ComponentFixture<ConnectionEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionEditComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ConnectionEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
