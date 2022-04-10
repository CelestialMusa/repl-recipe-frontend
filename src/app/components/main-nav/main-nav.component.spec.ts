import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainnavComponent } from './main-nav.component';

describe('SidenavComponent', () => {
  let component: MainnavComponent;
  let fixture: ComponentFixture<MainnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainnavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
