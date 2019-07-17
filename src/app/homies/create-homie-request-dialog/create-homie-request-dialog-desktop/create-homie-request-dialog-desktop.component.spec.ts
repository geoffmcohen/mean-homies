import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHomieRequestDialogDesktopComponent } from './create-homie-request-dialog-desktop.component';

describe('CreateHomieRequestDialogDesktopComponent', () => {
  let component: CreateHomieRequestDialogDesktopComponent;
  let fixture: ComponentFixture<CreateHomieRequestDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHomieRequestDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHomieRequestDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
