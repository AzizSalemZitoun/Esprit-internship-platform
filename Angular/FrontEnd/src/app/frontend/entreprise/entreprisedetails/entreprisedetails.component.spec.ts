import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseDetailsComponent } from './entreprisedetails.component';

describe('EntrepriseDetailsComponent', () => {
  let component: EntrepriseDetailsComponent;
  let fixture: ComponentFixture<EntrepriseDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepriseDetailsComponent]
    });
    fixture = TestBed.createComponent(EntrepriseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
