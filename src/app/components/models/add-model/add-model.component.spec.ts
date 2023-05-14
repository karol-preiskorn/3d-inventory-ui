import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { AddModelComponent } from './add-model.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule, FormGroup } from '@angular/forms'
describe('AddModelComponent', () => {
  let component: AddModelComponent
  let fixture: ComponentFixture<AddModelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModelComponent],
      imports: [HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(AddModelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
