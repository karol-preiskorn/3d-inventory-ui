import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { ModelAddComponent } from './add-model.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule, FormGroup } from '@angular/forms'
describe('ModelAddComponent', () => {
  let component: ModelAddComponent
  let fixture: ComponentFixture<ModelAddComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelAddComponent],
      imports: [HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ModelAddComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
