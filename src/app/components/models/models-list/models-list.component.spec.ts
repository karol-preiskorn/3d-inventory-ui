import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModelsListComponent } from './models-list.component'
import {
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http'

describe('ModelsListComponent', () => {
  let component: ModelsListComponent
  let fixture: ComponentFixture<ModelsListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelsListComponent, HttpClientModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ModelsListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
