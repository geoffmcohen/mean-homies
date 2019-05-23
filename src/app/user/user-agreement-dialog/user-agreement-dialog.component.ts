import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-user-agreement-dialog',
  templateUrl: './user-agreement-dialog.component.html',
  styleUrls: ['./user-agreement-dialog.component.css']
})
export class UserAgreementDialogComponent implements OnInit {
  private userHasScrolled: boolean;
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
    private dialogRef: MatDialogRef<UserAgreementDialogComponent>
  ) { }

  ngOnInit() {
    // Set a flag indicating that the user has not scrolled through the box
    this.userHasScrolled = false;
  }

  ngAfterViewChecked(){
    // If the user has not yet touched the scrollbar of the agreement, move the scroll to the top
    if(!this.userHasScrolled){
      // This is a hack to ensure the beginning of the agreement is shown when the dialog comes up
      document.getElementById("agreementTextarea").scrollTop = 0;
    }
  }

  // Triggered when the agreement is scrolled
  agreementScroll(){
    // Set whether the user has scrolled the agreement so the scrolling doesn't move to the top unexpectedly
    this.userHasScrolled = true;
  }

  submitAgreement(){
    // Close the dialog and return whether the user agreed
    this.dialogRef.close(this.userAgrees);
  }

}
