import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators, ValidatorFn, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css']
})
export class SignupDialogComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email], this.validateEmailIsTaken(this.userService));
  username = new FormControl('', [Validators.required], this.validateUsernameIsTaken(this.userService));
  password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]);
  passwordConfirm = new FormControl('', [Validators.required, this.validatePasswordsMatch(this.password)]);

  public passwordRequirements = "Min 8 chars, at least 1 upper, 1 lower & 1 number";
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<SignupDialogComponent>,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  submitSignupForm(){
    if(this.checkFieldValidations()){
      // Show the loading dialog
      this.showLoadingDialog();

      // Create the new user account
      this.userService.createUser(this.email.value, this.username.value, this.password.value, (res: any) => {
        // Hide the loading dialog
        this.closeLoadingDialog();
        this.message = null;

        // Close this dialog and show snackbar if successful
        if(res.success){
          this.dialogRef.close();
          this.snackBar.open(res.message, "Close");
        } else {
          this.password.setValue("");
          this.passwordConfirm.setValue("");
          this.message = res.message;
        }
      });
    } else {
      this.message = "Please clear errors above.";
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

  // Gets an error message for an email
  getEmailErrorMessage() {
    if(this.email.hasError('required')){
      return "Email is required";
    } else if (this.email.hasError('email')){
      return "Invalid email address";
    } else if (this.email.hasError('isTaken')){
      return "Email is already attached to an existing account";
    }
  }

  // Gets an error message for an username
  getUsernameErrorMessage() {
    if(this.username.hasError('required')){
      return "Username is required";
    } else if (this.username.hasError('isTaken')){
      return "Username is in use. Please select a new username.";
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

  // Validate that email is available
  validateEmailIsTaken(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return userService.checkIfEmailIsTaken(control.value).pipe(map(
        res => {
          if(res.taken) {
            return {isTaken: true};
          } else {
            return null;
          }
        }
      ));
    }
  }

  // Validate that email is available
  validateUsernameIsTaken(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return userService.checkIfUsernameIsTaken(control.value).pipe(map(
        res => {
          if(res.taken) {
            return {isTaken: true};
          } else {
            return null;
          }
        }
      ));
    }
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

  // Check field validations
  checkFieldValidations() : boolean{
      // Reset passwordConfirm in case password was edited after Confirm
      this.passwordConfirm.updateValueAndValidity();

      // Check each control
      if (this.email.errors || this.username.errors || this.password.errors|| this.passwordConfirm.errors) {
        return false;
      } else {
        return true;
      }
  }
}
