import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeDictionaryComponent } from './add-attribute-dictionary.component';

describe('AddAttributeDictionaryComponent', () => {
  let component: AddAttributeDictionaryComponent;
  let fixture: ComponentFixture<AddAttributeDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttributeDictionaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAttributeDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
