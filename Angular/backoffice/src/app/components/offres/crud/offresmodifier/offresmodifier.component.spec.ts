import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresmodifierComponent } from './offresmodifier.component';

describe('OffresmodifierComponent', () => {
  let component: OffresmodifierComponent;
  let fixture: ComponentFixture<OffresmodifierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffresmodifierComponent]
    });
    fixture = TestBed.createComponent(OffresmodifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
