import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  public title: string;
  public message: string;
  public yesButtonText: string;
  public yesButtonIcon: string;
  public noButtonText: string;
  public noButtonIcon: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    // Set the title of the dialog
    this.title = data.title;
    
    // Set the message to display
    this.message = data.message;

    // Set the yes and no button parameters if provided
    this.yesButtonText = data.yesButtonText ? data.yesButtonText : "Yes";
    this.yesButtonIcon = data.yesButtonIcon ? data.yesButtonIcon : null;
    this.noButtonText = data.noButtonText ? data.noButtonText : "No";
    this.noButtonIcon = data.noButtonIcon ? data.noButtonIcon : null;
  }

  ngOnInit() {
  }

  // Called when yes button is clicked
  yesClick(){
    this.dialogRef.close(true);
  }

  // Called when no button is clicked
  noClick(){
    this.dialogRef.close(false);
  }

}
