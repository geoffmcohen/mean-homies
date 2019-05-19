import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  public usernameOrEmail: string;
  public password: string;
  public message: string;
  public showPasswordReset: boolean;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) { }

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
        this.dialogRef.close( true );
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
    console.log("showPasswordResetDialog() called");
  }
}
