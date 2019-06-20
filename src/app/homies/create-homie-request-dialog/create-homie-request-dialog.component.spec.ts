import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHomieRequestDialogComponent } from './create-homie-request-dialog.component';

describe('CreateHomieRequestDialogComponent', () => {
  let component: CreateHomieRequestDialogComponent;
  let fixture: ComponentFixture<CreateHomieRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHomieRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHomieRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
