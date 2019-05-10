import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// import { ModalService } from '../../shared/modal.service';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { AuthenticationService } from '../../auth/authentication.service';

import { AdminLoginDialogComponent } from '../admin-login-dialog/admin-login-dialog.component';

@Component({
  selector: 'app-admin-user-area',
  templateUrl: './admin-user-area.component.html',
  styleUrls: ['./admin-user-area.component.css']
})
export class AdminUserAreaComponent implements OnInit {
  @Output() loggedInOutput = new EventEmitter<boolean>();

  public username: string;
  public password: string;
  public message: string;

  public loggedIn: boolean;
  public loggedInUser: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loggedIn = this.authService.checkAdminIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getAdminUser();
    }
  }

  // Show the login dialog
  showLoginDialog(){
    // Create the login dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Show the dialog
    const dialogRef = this.dialog.open(AdminLoginDialogComponent, dialogConfig);

    // See what the result of the dialog is
    dialogRef.afterClosed().subscribe(loggedIn => {
      if(loggedIn){
        // Set the loggedIn flag and username
        this.loggedIn = true;
        this.loggedInUser = this.authService.getAdminUser();

        // Alert parent that user has logged in
        this.notifyLoginChange();
      }
    });
  }

  // Allow user to log out
  logout(){
    this.authService.adminLogout();
    this.loggedIn = false;
    this.loggedInUser = null;

    // Alert parent that user has logged out
    this.notifyLoginChange();
  }

  notifyLoginChange(){
    this.loggedInOutput.emit(this.loggedIn);
  }



}
