import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChartComponentComponent } from './user-chart-component.component';

describe('UserChartComponentComponent', () => {
  let component: UserChartComponentComponent;
  let fixture: ComponentFixture<UserChartComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserChartComponentComponent]
    });
    fixture = TestBed.createComponent(UserChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
