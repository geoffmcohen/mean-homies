import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ProfileViewDialogComponent } from '../../user/profile-view-dialog/profile-view-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

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
  private confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;

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

      // Show a snackbar with the message returned
      this.snackBar.open(res.message, "Close");
    });
  }

  // Blocks a user from contacting this user again
  blockUser(){
     // Display confirmation dialog
     const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = true;
     dialogConfig.data = {
       title: 'Confirm User Block',
       message: "Are you sure you would like to block " + this.homieRequest.requestUser + "?  This will mean you will no longer be able to see or contact each other."
     };

     // Show the profile dislay dialog
     this.confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

     // If the user confirmed, then delete the request and block the user
     this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
       if(confirmed){
        // Show the loading dialog
        this.showLoadingDialog();

        // Decline the request first
        this.homiesService.declineHomieRequest(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
          // Make the call to block the user
          this.homiesService.blockUser(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
            // Hide the loaidng dialog
            this.closeLoadingDialog();

            // Show a snackbar with the message returned
            this.snackBar.open(res.message, "Close");
          });
        });
      }
    });
  }

  // Deletes the request this user sent
  deleteRequest(){
   // Display confirmation dialog
   const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.data = {
     title: 'Confirm Homie Request Delete',
     message: 'Are you sure you would like to delete the Homie Request you sent to ' + this.homieRequest.acceptUser + "?"
   };

   // Show the profile dislay dialog
   this.confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

   // If the user confirmed, then delete the request
   this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
     if(confirmed){
       // Show the loading dialog
       this.showLoadingDialog();

       // Make the call to delete the request
       this.homiesService.deleteHomieRequest(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, (res : any) => {
         // Hide the loaidng dialog
         this.closeLoadingDialog();

         // Show a snackbar with the message returned
         this.snackBar.open(res.message, "Close");
       });
     }
   });
 }
}
