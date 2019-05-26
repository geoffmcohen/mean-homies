import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public loggedIn: boolean;
  public loggedInUser: string;
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  displayName = new FormControl('', []);
  aboutMe = new FormControl('', []);
  lookingToMeet = new FormControl('', []);

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Get initial login state and track changes
    this.subscribeToLoginChanges();

    // If logged in, get and set the existing values
    if(this.loggedIn){
      // Show loading dialog
      this.showLoadingDialog();

      this.userService.getUserProfile(this.loggedInUser, (res : any) => {
        // Hide loading dialog
        this.closeLoadingDialog();

        // If a profile exists, set the form values
        if(res.success){
          this.displayName.setValue(res.profile.displayName);
          this.aboutMe.setValue(res.profile.aboutMe);
          this.lookingToMeet.setValue(res.profile.lookingToMeet);
        }
      });
    }
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

  // Attempts to save the users profile
  saveProfile(){
    // Show loading dialog
    this.showLoadingDialog();

    // Make the call to the user service to save the profile
    this.userService.saveUserProfile(this.loggedInUser, this.displayName.value, this.aboutMe.value, this.lookingToMeet.value, (res : any) => {
      // Hide loading dialog
      this.closeLoadingDialog();
      this.message = null;

      if(res.success){
        // Display a Snackbar with message
        this.snackBar.open(res.message, "Close");
      } else {
        // Display the error message in the message section
        this.message = res.message;
      }
    });
  }
}
