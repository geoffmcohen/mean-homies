import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ProfileViewDialogComponent } from '../../user/profile-view-dialog/profile-view-dialog.component';

@Component({
  selector: 'app-homie-request',
  templateUrl: './homie-request.component.html',
  styleUrls: ['./homie-request.component.css']
})
export class HomieRequestComponent implements OnInit {
  @Input() homieRequest: any;
  @Input() requestType: string;
  public profile: any;
  public profileImage: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private profileDialogRef: MatDialogRef<ProfileViewDialogComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Get the other user based on the type of request
    var user = this.requestType == 'pending' ? this.homieRequest.requestUser : this.homieRequest.acceptUser;

    // If the homie request message is blank, set it to a return char for display purposes
    if (this.homieRequest.message.length < 1) this.homieRequest.message = "\n";

    // Set the profile image to the default
    this.profileImage = '../../../assets/images/default profile.gif';

    // Get the profile and profile image
    this.userService.getUserProfile(this.authService.getUserToken(), user, (res : any) => {
      if(res.success) this.profile = res.profile;

      this.userService.getUserProfilePicture(this.authService.getUserToken(), user, (res : any) => {
        if(res.success) this.profileImage = res.imageUrl;
      });
    });
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

  // Accepts a users homie request
  acceptHomieRequest(){
    // Show the loading dialog
    this.showLoadingDialog();

    // Make the service call to accept the request
    this.homiesService.acceptHomieRequest(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
      // Hide the loding dialog
      this.closeLoadingDialog();

      // If successful, refresh the homie status
      // if(res.success){
      //   this.refreshHomieStatus();
      // }

      // Show a snackbar with the message returned
      this.snackBar.open(res.message, "Close");
    });
  }

  // Declines a users homie request
  declineHomieRequest(){
    // Show the loading dialog
    this.showLoadingDialog();

    // Make the service call to decline the request
    this.homiesService.declineHomieRequest(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
      // Hide the loding dialog
      this.closeLoadingDialog();

      // // If successful, refresh the homie status
      // if(res.success){
      //   this.refreshHomieStatus();
      // }

      // Show a snackbar with the message returned
      this.snackBar.open(res.message, "Close");
    });
  }

  // Blocks a user from contacting this user again
  // #TODO: This needs to be implemented
  blockUser(){
     console.log('blockUser() called');
  }

  // Deletes the request this user sent
  // #TODO: This needs to be implemented
  deleteRequest(){
     console.log('deleteRequest() called');
   }
}
