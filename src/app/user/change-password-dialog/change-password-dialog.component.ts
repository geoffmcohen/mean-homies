import { Component, OnInit } from '@angular/core';
import { FormControl, AbstractControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  oldPassword = new FormControl('', [Validators.required]);
  newPassword = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]);
  newPasswordConfirm = new FormControl('', [Validators.required, this.validatePasswordsMatch(this.newPassword)]);

  public passwordRequirements = "Min 8 chars, at least 1 upper, 1 lower & 1 number";
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private userService: UserService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  submitPasswordChange(){
    // Reset newPasswordConfirm in case new password was edited after Confirm
    this.newPasswordConfirm.updateValueAndValidity();

    // Check validity of fields
    if(this.oldPassword.invalid || this.newPassword.invalid || this.newPasswordConfirm.invalid){
      this.message = "Please clear errors above.";
    } else {
      // Show the loading dialog
      this.showLoadingDialog();

      // Call service to change the password and provide a message
      this.userService.changePassword(this.authService.getUser(), this.oldPassword.value, this.newPassword.value, (res: any) => {
        // Hide the loading dialog
        this.closeLoadingDialog();
        this.message = null;

        // Show a snackbar with a message and close the dialog
        if(res.success){
          this.dialogRef.close();
          this.snackBar.open(res.message, "Close");
        } else {
          this.clearFields();
          this.message = res.message;
        }
      });
    }
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

  //  Gets an error message for the old password
  getOldPasswordErrorMessage(){
    if(this.oldPassword.hasError('required')){
      return "Old Password is required";
    }
  }

  // Gets an error message for new password
  getNewPasswordErrorMessage() {
    if(this.newPassword.hasError('required')){
      return "New Password is required";
    }
    else if(this.newPassword.hasError('pattern')){
      return this.passwordRequirements;
    }
  }

  // Gets an error message for a password confirm
  getNewPasswordConfirmErrorMessage() {
    if(this.newPasswordConfirm.hasError('required')){
      return "New Password Confirm is required";
    } else if (this.newPasswordConfirm.hasError('passwordsMismatch')){
      return "New Passwords must match";
    }
  }

  // Validate that new password and newPasswordConfirm passwordMatch
  validatePasswordsMatch(matchControl: AbstractControl) : ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      if (control.value != matchControl.value) {
        return {passwordsMismatch: true};
      } else {
        return null;
      }
    };
  }

  // Clear the form fields
  clearFields(){
    this.oldPassword.setValue('');
    this.newPassword.setValue('');
    this.newPasswordConfirm.setValue('');
  }
}
