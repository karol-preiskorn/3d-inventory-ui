import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AttributeAddComponent } from './add-attribute.component'

describe('AttributeAddComponent', () => {
  let component: AttributeAddComponent
  let fixture: ComponentFixture<AttributeAddComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttributeAddComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AttributeAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
