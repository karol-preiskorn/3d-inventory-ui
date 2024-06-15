import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AttributeDictionaryAddComponent } from './add-attribute-dictionary.component'

describe('AttributeDictionaryAddComponent', () => {
  let component: AttributeDictionaryAddComponent
  let fixture: ComponentFixture<AttributeDictionaryAddComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttributeDictionaryAddComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AttributeDictionaryAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
