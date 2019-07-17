import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomiesDesktopComponent } from './homies-desktop.component';

describe('HomiesDesktopComponent', () => {
  let component: HomiesDesktopComponent;
  let fixture: ComponentFixture<HomiesDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomiesDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomiesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
