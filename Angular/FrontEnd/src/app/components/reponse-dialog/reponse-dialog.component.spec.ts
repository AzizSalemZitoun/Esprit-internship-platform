import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseDialogComponent } from './reponse-dialog.component';

describe('ReponseDialogComponent', () => {
  let component: ReponseDialogComponent;
  let fixture: ComponentFixture<ReponseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReponseDialogComponent]
    });
    fixture = TestBed.createComponent(ReponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
