import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprisedefaultComponent } from './entreprises.component';

describe('EntreprisesComponent', () => {
  let component: EntreprisedefaultComponent;
  let fixture: ComponentFixture<EntreprisedefaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntreprisedefaultComponent]
    });
    fixture = TestBed.createComponent(EntreprisedefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
