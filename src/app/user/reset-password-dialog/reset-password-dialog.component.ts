import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { ApplicationStateService } from '../../shared/application-state.service';
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  public isMobile: boolean;
  public isBaseClass: boolean = this.constructor.name == "ResetPasswordDialogComponents";
  public message: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private appStateService: ApplicationStateService,
    private userService: UserService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = appStateService.getIsMobile();
  }

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
          this.snackBar.open(res.message, "Close", {duration: 5000});
        } else {
          // Reset the email field and display the message
          this.email.setValue("");
          this.message = res.message;
        }
      });
    }
  }

  // Use for a close button on mobile
  close(){
    this.dialogRef.close(false);
  }
}
