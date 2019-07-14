import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, AbstractControl, Validators, ValidatorFn, ValidationErrors  } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { ApplicationStateService } from '../../shared/application-state.service';
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]);
  passwordConfirm = new FormControl('', [Validators.required, this.validatePasswordsMatch(this.password)]);

  public isMobile: boolean;
  public passwordRequirements = "Min 8 chars, at least 1 upper, 1 lower & 1 number";
  private resetToken: string;
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appStateService: ApplicationStateService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = this.appStateService.getIsMobile();
  }

  ngOnInit() {
    // Get the resetToken from parameters
    this.route.params.subscribe(params => {
      if (params['resetToken']) {
        this.resetToken = params['resetToken'];
      } else {
        // If no token redirect to home page
        this.router.navigate(['../../']);
      }
    });
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

  // Validate that password and passwordConfirm passwordMatch
  validatePasswordsMatch(matchControl: AbstractControl) : ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      if (control.value != matchControl.value) {
        return {passwordsMismatch: true};
      } else {
        return null;
      }
    };
  }

  // Gets an error message for an email
  getEmailErrorMessage() {
    if(this.email.hasError('required')){
      return "Email is required";
    } else if (this.email.hasError('email')){
      return "Invalid email address";
    }
  }

  // Gets an error message for a password
  getPasswordErrorMessage() {
    if(this.password.hasError('required')){
      return "Password is required";
    }
    else if(this.password.hasError('pattern')){
      return this.passwordRequirements;
    }
  }

  // Gets an error message for a password confirm
  getPasswordConfirmErrorMessage() {
    if(this.passwordConfirm.hasError('required')){
      return "Password Confirm is required";
    } else if (this.passwordConfirm.hasError('passwordsMismatch')){
      return "Passwords must match";
    }
  }

  // Clears the form fields
  clearFields(){
    this.email.setValue("");
    this.password.setValue("");
    this.passwordConfirm.setValue("");
  }

  // Submission of reset form
  resetPassword(){
    // Reset passwordConfirm in case password was edited after Confirm
    this.passwordConfirm.updateValueAndValidity();

    // Check validity of fields
    if(this.email.invalid || this.password.invalid || this.passwordConfirm.invalid){
      this.message = "Please clear errors above.";
    } else {
      // Show the loading dialog
      this.showLoadingDialog();

      // Call service to reset the password and provide a message
      this.userService.resetPassword(this.email.value, this.password.value, this.resetToken, (res: any) => {
        // Hide the loading dialog
        this.closeLoadingDialog();
        this.message = null;

        // Show a snackbar with a message and action to close the window
        if(res.success){
          let snackBarRef = this.snackBar.open(res.message, "Close", {duration: 5000});
          snackBarRef.onAction().subscribe(() => {
            window.close();
          });
        } else {
          this.clearFields();
          this.message = res.message;
        }
      });
    }
  }
}
