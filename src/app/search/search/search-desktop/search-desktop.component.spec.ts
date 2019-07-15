import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDesktopComponent } from './search-desktop.component';

describe('SearchDesktopComponent', () => {
  let component: SearchDesktopComponent;
  let fixture: ComponentFixture<SearchDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
