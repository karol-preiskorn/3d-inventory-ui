import { HttpClientModule, HttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { EditModelComponent } from './edit-model.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
describe('EditModelComponent', () => {
  let component: EditModelComponent
  let fixture: ComponentFixture<EditModelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditModelComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, HttpClientModule, ReactiveFormsModule],
      providers: [HttpClient],
    }).compileComponents()

    fixture = TestBed.createComponent(EditModelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
