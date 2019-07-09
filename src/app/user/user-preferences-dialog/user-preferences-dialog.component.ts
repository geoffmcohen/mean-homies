import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-user-preferences-dialog',
  templateUrl: './user-preferences-dialog.component.html',
  styleUrls: ['./user-preferences-dialog.component.css']
})
export class UserPreferencesDialogComponent implements OnInit {
  public sendNewMessageEmail: boolean;
  public sendHomieRequestReceiveEmail: boolean;
  public sendHomieRequestAcceptEmail: boolean;
  public message: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<UserPreferencesDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Get the users preferences if they exist
    this.getUserPreferences();
  }

  // Displays a loading dialog
  showLoadingDialog(){
    // Only show if loading dialog is undefined
    if(!this.loadingDialogRef){
      // Create the loading dialog
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      // Show the loading dialog
      this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);
    }
  };

  // Closes the loading dialog
  closeLoadingDialog(){
    // Only try to close if dialog ref defined
    if(this.loadingDialogRef){
      // Close the loading dialog
      this.loadingDialogRef.close();

      // Nullify the ref
      this.loadingDialogRef = null;
    }
  }

  // Gets the users preferences to display
  getUserPreferences(){
    // Show the loading dialog
    this.showLoadingDialog();

    // Try to get the users preferences from the database
    this.userService.getUserPreferences(this.authService.getUserToken(), this.authService.getUser(), (res : any) => {
      if(res.success){
        // If the record was found in the database, set the checkbox values accordingly
        this.sendNewMessageEmail = res.preferences.sendNewMessageEmail;
        this.sendHomieRequestReceiveEmail = res.preferences.sendHomieRequestReceiveEmail;
        this.sendHomieRequestAcceptEmail = res.preferences.sendHomieRequestAcceptEmail;
      } else {
        // If the record was not found, default the checkbox values to true
        this.sendNewMessageEmail = true;
        this.sendHomieRequestReceiveEmail = true;
        this.sendHomieRequestAcceptEmail = true;
      }

      // Hide the loading dialog
      this.closeLoadingDialog();
    });
  }

  // Saves the users preferences
  saveUserPreferences(){
    // Show the loading dialog
    this.showLoadingDialog();

    // Try to save the users preferences to the database
    this.userService.saveUserPreferences(this.authService.getUserToken(), this.authService.getUser(), this.sendNewMessageEmail, this.sendHomieRequestReceiveEmail, this.sendHomieRequestAcceptEmail, (res : any) => {
      // Hide the loading dialog
      this.closeLoadingDialog();
      this.message = null;

      if(res.success){
        // If successful, close this dialog and display a snackBar
        this.dialogRef.close();
        this.snackBar.open(res.message, "Close", {duration: 5000});
      } else {
        // Otherwise show the error message on the dialog
        this.message = res.message;
      }
    });
  }
}
