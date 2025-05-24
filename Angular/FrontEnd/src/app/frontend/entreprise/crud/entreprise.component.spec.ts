import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseajouterComponent } from './entreprise.component';

describe('EntrepriseComponent', () => {
  let component: EntrepriseajouterComponent;
  let fixture: ComponentFixture<EntrepriseajouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepriseajouterComponent]
    });
    fixture = TestBed.createComponent(EntrepriseajouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
