import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AddModelComponent } from './add-model.component'

describe('AddModelComponent', () => {
  let component: AddModelComponent
  let fixture: ComponentFixture<AddModelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModelComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AddModelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
