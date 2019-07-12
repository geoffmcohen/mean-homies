import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ApplicationStateService } from '../../shared/application-state.service';

@Component({
  selector: 'app-user-agreement-dialog',
  templateUrl: './user-agreement-dialog.component.html',
  styleUrls: ['./user-agreement-dialog.component.css']
})
export class UserAgreementDialogComponent implements OnInit {
  public isMobile: boolean;
  private agreementScrolled: boolean;
  public userAgrees: boolean;
  public userAgreement =
`This will be the user agreement...

Another paragraph of text.

And another...

And another...

And another...

One more for the road...
1
2
3
4
5
6
7
9
10
End`;

  constructor(
    private appStateService: ApplicationStateService,
    private dialogRef: MatDialogRef<UserAgreementDialogComponent>
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = appStateService.getIsMobile();
  }

  ngOnInit() {
  }

  ngAfterViewChecked(){
    // Finds the agreement text area
    var agreementText = document.getElementById("agreementTextarea");

    // If found, we will ensure that it is initially scrolled to the top
    if(agreementText){
      if(!this.agreementScrolled && agreementText.scrollTop != 0){
        agreementText.scrollTop = 0;
        this.agreementScrolled = true;
      }
    }
  }

  // Submit the agreement
  submitAgreement(){
    // Close the dialog and return whether the user agreed
    this.dialogRef.close(this.userAgrees);
  }

  // Use for a close button on mobile
  close(){
    this.dialogRef.close(false);
  }

}
