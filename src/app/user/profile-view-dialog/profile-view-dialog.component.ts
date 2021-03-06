import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { CreateHomieRequestDialogComponent } from '../../homies/create-homie-request-dialog/create-homie-request-dialog.component';
import { MessengerDialogComponent } from '../../messages/messenger-dialog/messenger-dialog.component';

@Component({
  selector: 'app-profile-view-dialog',
  templateUrl: './profile-view-dialog.component.html',
  styleUrls: ['./profile-view-dialog.component.css']
})
export class ProfileViewDialogComponent implements OnInit {
  public isMobile: boolean;
  public isBaseClass: boolean = this.constructor.name == "ProfileViewDialogComponent";
  public profile: any;
  public profileImage: string;
  public homieStatus: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private requestDialogRef: MatDialogRef<CreateHomieRequestDialogComponent>;
  private messengerDialogRef: MatDialogRef<MessengerDialogComponent>;

  constructor(
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProfileViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = appStateService.getIsMobile();

    // Gets the profile from the inpute data
    this.profile = data.profile;
  }

  ngOnInit() {
    if(!this.isBaseClass){
      // Set the profile image to the default
      this.profileImage = '../../../assets/images/default profile.gif';

      // Make the call to actually get the users profile Picture
      this.userService.getUserProfilePicture(this.authService.getUserToken(), this.profile.username, (res : any) => {
        if(res.success) this.profileImage = res.imageUrl;
      });

      // Get the homie status to see if the profile belongs to a homie
      this.refreshHomieStatus();
    }
  }

  // Refreshes homie status
  refreshHomieStatus(){
    this.homiesService.getHomieStatus(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
      if(res.success) this.homieStatus = res.status;
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

  // Closes the dialog
  close(){
    this.dialogRef.close();
  }

  // Accepts a homie request
  acceptHomieRequest(){
    // Show the loading dialog
    this.showLoadingDialog();

    // Make the service call to accept the request
    this.homiesService.acceptHomieRequest(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
      // Hide the loding dialog
      this.closeLoadingDialog();

      // If successful, refresh the homie status
      if(res.success){
        this.refreshHomieStatus();
      }

      // Show a snackbar with the message returned
      this.snackBar.open(res.message, "Close", {duration: 5000});
    });
  }

  // Declines a homie request
  declineHomieRequest(){
    // Show the loading dialog
    this.showLoadingDialog();

    // Make the service call to decline the request
    this.homiesService.declineHomieRequest(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
      // Hide the loding dialog
      this.closeLoadingDialog();

      // If successful, refresh the homie status
      if(res.success){
        this.refreshHomieStatus();
      }

      // Show a snackbar with the message returned
      this.snackBar.open(res.message, "Close", {duration: 5000});
    });
  }

  // Opens the messenger dialog to allow for messaging
  sendHomieMessage(){
    // Create dialog configs for messenger dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { profile: this.profile };

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    } else {
      dialogConfig.minWidth = "768px";
      dialogConfig.maxWidth = "768px";
    }

    // Show the messenger dialog
    this.messengerDialogRef = this.dialog.open(MessengerDialogComponent, dialogConfig);
  }
}
