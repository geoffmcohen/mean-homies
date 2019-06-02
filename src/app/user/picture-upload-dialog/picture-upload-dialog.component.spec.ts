import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUploadDialogComponent } from './picture-upload-dialog.component';

describe('PictureUploadDialogComponent', () => {
  let component: PictureUploadDialogComponent;
  let fixture: ComponentFixture<PictureUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
