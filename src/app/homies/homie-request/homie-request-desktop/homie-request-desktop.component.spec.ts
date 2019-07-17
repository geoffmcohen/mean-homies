import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieRequestDesktopComponent } from './homie-request-desktop.component';

describe('HomieRequestDesktopComponent', () => {
  let component: HomieRequestDesktopComponent;
  let fixture: ComponentFixture<HomieRequestDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomieRequestDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomieRequestDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
