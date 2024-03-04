import { HttpClientModule, HttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ModelEditComponent } from './edit-model.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
describe('ModelEditComponent', () => {
  let component: ModelEditComponent
  let fixture: ComponentFixture<ModelEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, HttpClientModule, ReactiveFormsModule],
      providers: [HttpClient],
    }).compileComponents()

    fixture = TestBed.createComponent(ModelEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
