import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseajoutComponent } from './entrepriseajout.component';

describe('EntrepriseajoutComponent', () => {
  let component: EntrepriseajoutComponent;
  let fixture: ComponentFixture<EntrepriseajoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepriseajoutComponent]
    });
    fixture = TestBed.createComponent(EntrepriseajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
