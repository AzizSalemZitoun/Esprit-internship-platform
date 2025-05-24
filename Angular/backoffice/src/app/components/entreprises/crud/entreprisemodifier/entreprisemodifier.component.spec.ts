import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprisemodifierComponent } from './entreprisemodifier.component';

describe('EntreprisemodifierComponent', () => {
  let component: EntreprisemodifierComponent;
  let fixture: ComponentFixture<EntreprisemodifierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntreprisemodifierComponent]
    });
    fixture = TestBed.createComponent(EntreprisemodifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
