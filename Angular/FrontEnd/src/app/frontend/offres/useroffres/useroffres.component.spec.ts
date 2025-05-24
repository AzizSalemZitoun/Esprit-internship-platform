import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseroffreComponent } from './useroffres.component';

describe('UseroffresComponent', () => {
  let component: UseroffreComponent;
  let fixture: ComponentFixture<UseroffreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UseroffreComponent]
    });
    fixture = TestBed.createComponent(UseroffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
