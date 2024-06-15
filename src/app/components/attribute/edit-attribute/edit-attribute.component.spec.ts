import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AttributeDictionaryEditComponent } from './edit-attribute.component'

describe('AttributeDictionaryEditComponent', () => {
  let component: AttributeDictionaryEditComponent
  let fixture: ComponentFixture<AttributeDictionaryEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttributeDictionaryEditComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AttributeDictionaryEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
