import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBlogPostComponent } from './new-blog-post.component';

describe('NewBlogPostComponent', () => {
  let component: NewBlogPostComponent;
  let fixture: ComponentFixture<NewBlogPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBlogPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
