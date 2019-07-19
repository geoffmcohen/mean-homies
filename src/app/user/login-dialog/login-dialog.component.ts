import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  public isMobile: boolean;
  public isBaseClass: boolean = this.constructor.name == "LoginDialogComponent";
  public usernameOrEmail: string;
  public password: string;
  public message: string;
  public showPasswordReset: boolean;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private resetDialogRef: MatDialogRef<ResetPasswordDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = this.appStateService.getIsMobile();
  }

  ngOnInit() {
  }

  // Start the loading
  submitLoginForm(){
    // Show loading dialog
    this.showLoadingDialog();

    // Make call to authentication service
    this.authService.userLogin(this.usernameOrEmail, this.password, (res: any) => {
      // Hide loading dialog
      this.closeLoadingDialog();
      this.message = null;
      this.showPasswordReset = false;

      // Return a true if successfully logged in
      if(res.success){
        // Close this dialog
        this.dialogRef.close( true );

        // Reload the current page
        document.location.reload();
      } else {
        this.password = "";
        this.message = res.message;

        // Perform specific actions based on the message
        if (this.message.match(/No user found/)){
          // Clear the username field if not username is found
          this.usernameOrEmail = "";
        } else if (this.message.match(/Incorrect password/)){
          // Show the password reset button
          this.showPasswordReset = true;
        }
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

  // Show password reset dialog
  showPasswordResetDialog(){
    // Create the password reset dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    }

    // Show the password reset dialog
    this.resetDialogRef = this.dialog.open(ResetPasswordDialogComponent, dialogConfig);

    // Handle actions after password reset dialog is closed
    this.resetDialogRef.afterClosed().subscribe(reset => {
      // Close this dialog if the user initiated a password reset
      if (reset){
        this.dialogRef.close();
      }
    });
  }

  // Use for a close button on mobile
  close(){
    this.dialogRef.close(false);
  }
}
