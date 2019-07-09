import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ProfileViewDialogComponent } from '../../user/profile-view-dialog/profile-view-dialog.component';
import { CreateHomieRequestDialogComponent } from '../../homies/create-homie-request-dialog/create-homie-request-dialog.component';
import { MessengerDialogComponent } from '../../messages/messenger-dialog/messenger-dialog.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  @Input() profile: any;
  public profileImage: string;
  public homieStatus: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private profileDialogRef: MatDialogRef<ProfileViewDialogComponent>;
  private requestDialogRef: MatDialogRef<CreateHomieRequestDialogComponent>;
  private messengerDialogRef: MatDialogRef<MessengerDialogComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Set the profile image to the default
    this.profileImage = '../../../assets/images/default profile.gif';

    // Make the call to actually get the users profile Picture
    this.userService.getUserProfilePicture(this.authService.getUserToken(), this.profile.username, (res : any) => {
      if(res.success) this.profileImage = res.imageUrl;
    });

    // Get the homie status to see if the profile belongs to a homie
    this.refreshHomieStatus();
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

  // Displays the profile dialog
  showProfileDialog(){
    // Create the profile display dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {profile: this.profile};
    dialogConfig.minWidth = "90%";

    // Show the profile dislay dialog
    this.profileDialogRef = this.dialog.open(ProfileViewDialogComponent, dialogConfig);
  }

  // Displays the dialog to create a homie request
  showHomieRequestDialog(){
    // Create the homie request dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {profile: this.profile};
    dialogConfig.minWidth =  400;


    // Show the homie request dialog
    this.requestDialogRef = this.dialog.open(CreateHomieRequestDialogComponent, dialogConfig);

    // If the request was made, update the homie status
    this.requestDialogRef.afterClosed().subscribe(requestSubmitted => {
      if(requestSubmitted){
        this.refreshHomieStatus();
      }
    });
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

    // #TODO: Have to figure out how to make this mobile friendly
    dialogConfig.minWidth = "800px";
    dialogConfig.maxWidth = "800px";

    // Show the messenger dialog
    this.messengerDialogRef = this.dialog.open(MessengerDialogComponent, dialogConfig);
  }
}
