import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { AddModelComponent } from './add-model.component'

describe('AddModelComponent', () => {
  let component: AddModelComponent
  let fixture: ComponentFixture<AddModelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModelComponent, HttpClientModule],
    }).compileComponents()

    fixture = TestBed.createComponent(AddModelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
