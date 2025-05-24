import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogdisplComponent } from './blogdispl.component';

describe('BlogdisplComponent', () => {
  let component: BlogdisplComponent;
  let fixture: ComponentFixture<BlogdisplComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogdisplComponent]
    });
    fixture = TestBed.createComponent(BlogdisplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
