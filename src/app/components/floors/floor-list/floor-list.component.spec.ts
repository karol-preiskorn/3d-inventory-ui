import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorListComponent } from './floor-list.component';

describe('FloorListComponent', () => {
  let component: FloorListComponent;
  let fixture: ComponentFixture<FloorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorListComponent]
    });
    fixture = TestBed.createComponent(FloorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
