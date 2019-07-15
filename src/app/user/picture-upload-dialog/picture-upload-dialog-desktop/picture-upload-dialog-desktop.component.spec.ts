import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUploadDialogDesktopComponent } from './picture-upload-dialog-desktop.component';

describe('PictureUploadDialogDesktopComponent', () => {
  let component: PictureUploadDialogDesktopComponent;
  let fixture: ComponentFixture<PictureUploadDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureUploadDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
