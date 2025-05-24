import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresajouterComponent } from './offresajouter.component';

describe('OffresajouterComponent', () => {
  let component: OffresajouterComponent;
  let fixture: ComponentFixture<OffresajouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffresajouterComponent]
    });
    fixture = TestBed.createComponent(OffresajouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
