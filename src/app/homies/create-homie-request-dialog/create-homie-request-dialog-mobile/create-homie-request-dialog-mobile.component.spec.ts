import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHomieRequestDialogMobileComponent } from './create-homie-request-dialog-mobile.component';

describe('CreateHomieRequestDialogMobileComponent', () => {
  let component: CreateHomieRequestDialogMobileComponent;
  let fixture: ComponentFixture<CreateHomieRequestDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHomieRequestDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHomieRequestDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
