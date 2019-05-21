import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  // Displays a loading dialog
  showLoadingDialog(){
    // Create the loading dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Show the loading dialog
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);
  };

  // Closes the loading dialog
  closeLoadingDialog(){
    this.loadingDialogRef.close();
  }

  // Gets an error message for an email
  getEmailErrorMessage() {
    if(this.email.hasError('required')){
      return "Email is required";
    } else if (this.email.hasError('email')){
      return "Invalid email address";
    }
  }

  // Requests a password reset for the email
  submitResetForm(){
    // Check validation
    if(this.email.invalid){
      this.message = "Please clear errors above.";
    } else {
      // Display loading
      this.showLoadingDialog();

      // Call reset function
      this.userService.requestPasswordReset(this.email.value, (res : any) => {
        // Hide loading dialog
        this.closeLoadingDialog();
        this.message = null;

        if (res.success){
          // Close this dialog and display the message in a snackbar
          this.dialogRef.close(true);
          this.snackBar.open(res.message, "Close");
        } else {
          // Reset the email field and display the message
          this.email.setValue("");
          this.message = res.message;
        }
      });
    }
  }
}
