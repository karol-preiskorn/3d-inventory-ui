import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConnectionListComponent } from '../components/connection/connection-list/connection-list.component'

describe('ConnectionListComponent', () => {
  let component: ConnectionListComponent
  let fixture: ComponentFixture<ConnectionListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionListComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ConnectionListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
