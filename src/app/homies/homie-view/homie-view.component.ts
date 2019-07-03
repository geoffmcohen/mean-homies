import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ProfileViewDialogComponent } from '../../user/profile-view-dialog/profile-view-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MessengerDialogComponent } from '../../messages/messenger-dialog/messenger-dialog.component';

@Component({
  selector: 'app-homie-view',
  templateUrl: './homie-view.component.html',
  styleUrls: ['./homie-view.component.css']
})
export class HomieViewComponent implements OnInit {
  @Input() homie: string;
  public profile: any;
  public profileImage: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private profileDialogRef: MatDialogRef<ProfileViewDialogComponent>;
  private confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
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

    // Get the profile and profile image
    this.userService.getUserProfile(this.authService.getUserToken(), this.authService.getUser(), this.homie, (res : any) => {
      if(res.success) this.profile = res.profile;

      this.userService.getUserProfilePicture(this.authService.getUserToken(), this.homie, (res : any) => {
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

  // Removes the homie from your list
  removeHomie(){
    // Show a confirmation dialog to make sure the user wants to remove their homie
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm Homie Removal',
      message: "Are you sure you would like to remove " + this.profile.username + " from your homies?"
    };

    // Show the confirmation dialog
    this.confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    // If the user confirmed, then delete the request and block the user
    this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
      if(confirmed){
        // Show the loading dialog
        this.showLoadingDialog();

        // Call the homie removal method first
        this.homiesService.removeHomie(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
          // Hide the loading dialog
          this.closeLoadingDialog();

          if(res.success){
            // Prompt the user to ask if they would also like to block this user
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.data = {
              title: 'Block User',
              message: res.message + "  Would you also like to block " + this.profile.username + "?  This will mean you will no longer be able to see or contact each other."
            };

            // Show the profile dislay dialog
            this.confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

            // If the user confirmed, then create the block
            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
              if(confirmed){
                // Show the loading dialog
                this.showLoadingDialog();

                // Call the block method
                this.homiesService.blockUser(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) =>{
                  // Hide the loading dialog
                  this.closeLoadingDialog();

                  // Show a snackbar with the message returned
                  this.snackBar.open(res.message, "Close");
                });
              }
            });
          } else {
            // Show a snackbar with the message returned
            this.snackBar.open(res.message, "Close");
          }
        });
      }
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
