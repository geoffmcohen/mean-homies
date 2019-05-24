import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthenticationService } from '../../auth/authentication.service';
import { LoginDialogComponent } from '../../user/login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../../user/signup-dialog/signup-dialog.component';
import { UserAgreementDialogComponent } from '../../user/user-agreement-dialog/user-agreement-dialog.component';
import { ChangePasswordDialogComponent } from '../../user/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-home-user-area',
  templateUrl: './home-user-area.component.html',
  styleUrls: ['./home-user-area.component.css']
})
export class HomeUserAreaComponent implements OnInit {
  @Output() loggedInOutput = new EventEmitter<boolean>();

  public loggedIn: boolean;
  public loggedInUser: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loggedIn = this.authService.checkUserIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();
    }
  }

  showLoginDialog(){
    // Create the login dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Show the dialog for login
    const dialogRef = this.dialog.open(LoginDialogComponent, dialogConfig)

    // Handle actions after dialog closed
    dialogRef.afterClosed().subscribe(loggedIn => {
      if(loggedIn){
        // Set the loggedIn flag and username
        this.loggedIn = true;
        this.loggedInUser = this.authService.getUser();

        // Alert parent that user has logged in
        this.notifyLoginChange();
      }
    });
  }

  showSignupDialog(){
    // Create the config to be used for the dialogs
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Show user agreement first and only display signup if accepted
    var userAgreementDialogRef = this.dialog.open(UserAgreementDialogComponent, dialogConfig);
    userAgreementDialogRef.afterClosed().subscribe(userAgrees => {
      if(userAgrees){
        // Show the dialog for sign up
        var signupDialogRef = this.dialog.open(SignupDialogComponent, dialogConfig)
      }
    })
  }

  // Allow user to log out
  logout(){
    this.authService.userLogout();
    this.loggedIn = false;
    this.loggedInUser = null;

    // Alert parent that user has logged out
    this.notifyLoginChange();
  }

  // Notifies the parent that user has logged in or out
  notifyLoginChange(){
    this.loggedInOutput.emit(this.loggedIn);
  }

  // Shows the dialog used for updating the users password
  showChangePasswordDialog(){
    // Show the dialog for the user to update their password
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ChangePasswordDialogComponent, dialogConfig);
  }
}
