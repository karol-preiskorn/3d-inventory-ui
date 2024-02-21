import { HttpClientModule } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ModelsListComponent } from './models-list.component'
import { NgxPaginationModule } from 'ngx-pagination'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'


describe('ModelsListComponent', () => {
  let component: ModelsListComponent
  let fixture: ComponentFixture<ModelsListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelsListComponent],
      imports: [HttpClientModule, RouterTestingModule, NgxPaginationModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ModelsListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
