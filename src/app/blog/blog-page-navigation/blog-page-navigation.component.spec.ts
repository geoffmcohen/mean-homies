import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPageNavigationComponent } from './blog-page-navigation.component';

describe('BlogPageNavigationComponent', () => {
  let component: BlogPageNavigationComponent;
  let fixture: ComponentFixture<BlogPageNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogPageNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
