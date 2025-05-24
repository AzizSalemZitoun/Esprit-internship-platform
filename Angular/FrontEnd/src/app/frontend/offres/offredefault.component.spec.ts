import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresdefaultComponent } from './offredefault.component';

describe('OffresdefaultComponent', () => {
  let component: OffresdefaultComponent;
  let fixture: ComponentFixture<OffresdefaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffresdefaultComponent]
    });
    fixture = TestBed.createComponent(OffresdefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
