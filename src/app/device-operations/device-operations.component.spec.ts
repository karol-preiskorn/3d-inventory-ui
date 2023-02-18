import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOperationsComponent } from './device-operations.component';

describe('DeviceOperationsComponent', () => {
  let component: DeviceOperationsComponent;
  let fixture: ComponentFixture<DeviceOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
