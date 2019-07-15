import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUploadDialogMobileComponent } from './picture-upload-dialog-mobile.component';

describe('PictureUploadDialogMobileComponent', () => {
  let component: PictureUploadDialogMobileComponent;
  let fixture: ComponentFixture<PictureUploadDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureUploadDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
