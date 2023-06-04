import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttributeDictionaryComponent } from './edit-attribute.component';

describe('EditAttributeDictionaryComponent', () => {
  let component: EditAttributeDictionaryComponent;
  let fixture: ComponentFixture<EditAttributeDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAttributeDictionaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAttributeDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
