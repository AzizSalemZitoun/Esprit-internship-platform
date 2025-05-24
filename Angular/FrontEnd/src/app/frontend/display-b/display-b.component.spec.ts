import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBComponent } from './display-b.component';

describe('DisplayBComponent', () => {
  let component: DisplayBComponent;
  let fixture: ComponentFixture<DisplayBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayBComponent]
    });
    fixture = TestBed.createComponent(DisplayBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
