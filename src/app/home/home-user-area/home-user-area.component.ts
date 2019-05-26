import { Component, OnInit } from '@angular/core';
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
  public loggedIn: boolean;
  public loggedInUser: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    // Get initial login state and track changes
    this.subscribeToLoginChanges();
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();
    }

    // Subscribe to login changes
    this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      if(this.loggedIn){
        this.loggedInUser = this.authService.getUser();
      } else {
        this.loggedInUser = null;
      }
    });
  }

  showLoginDialog(){
    // Create the login dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Show the dialog for login
    this.dialog.open(LoginDialogComponent, dialogConfig)
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
  }

  // Shows the dialog used for updating the users password
  showChangePasswordDialog(){
    // Show the dialog for the user to update their password
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ChangePasswordDialogComponent, dialogConfig);
  }
}
