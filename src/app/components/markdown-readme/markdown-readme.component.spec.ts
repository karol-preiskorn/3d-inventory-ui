import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MarkdownReadmeComponent } from './markdown-readme.component'

describe('MarkdownReadmeComponent', () => {
  let component: MarkdownReadmeComponent
  let fixture: ComponentFixture<MarkdownReadmeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkdownReadmeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(MarkdownReadmeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
