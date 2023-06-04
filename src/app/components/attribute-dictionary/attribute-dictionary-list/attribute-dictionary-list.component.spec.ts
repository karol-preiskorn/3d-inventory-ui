import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDictionaryListComponent } from './attribute-dictionary-list.component';

describe('AttributeDictionaryListComponent', () => {
  let component: AttributeDictionaryListComponent;
  let fixture: ComponentFixture<AttributeDictionaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeDictionaryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeDictionaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
