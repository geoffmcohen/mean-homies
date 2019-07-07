import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
// import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { MessengerDialogComponent } from '../../messages/messenger-dialog/messenger-dialog.component';
import { ProfileViewDialogComponent } from '../../user/profile-view-dialog/profile-view-dialog.component';

@Component({
  selector: 'app-conversation-view',
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.css']
})
export class ConversationViewComponent implements OnInit {
  @Input() latestMessage: any;
  @Input() profile: any;

  public loggedInUser: string;
  public conversationWithUser: string;
  public profileImage: string;

  // private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private messengerDialogRef: MatDialogRef<MessengerDialogComponent>;
  private profileDialogRef: MatDialogRef<ProfileViewDialogComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // Set the logged in user
    this.loggedInUser = this.authService.getUser();

    // Get the user that this conversation is with
    this.conversationWithUser = this.latestMessage.sendUser == this.loggedInUser ? this.latestMessage.receiveUser : this.latestMessage.sendUser;

    // Set the profile image to the default
    this.profileImage = '../../../assets/images/default profile.gif';

    // // Show the loading dialog
    // this.showLoadingDialog();

    // // Get the users profile
    // this.userService.getUserProfile(this.authService.getUserToken(), this.authService.getUser(), this.conversationWithUser, (res : any) => {
    //   if(res.success) this.profile = res.profile;
    //
    //   // // Hide the loading dialog
    //   // this.closeLoadingDialog();
    // });

    // Get the users profile image
    this.userService.getUserProfilePicture(this.authService.getUserToken(), this.conversationWithUser, (res : any) => {
      if(res.success) this.profileImage = res.imageUrl;
    });
  }

  // Opens the messenger dialog to allow for messaging
  openConversation(){
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

  // // Displays a loading dialog
  // showLoadingDialog(){
  //   // Only show if loading dialog is undefined
  //   if(!this.loadingDialogRef){
  //     // Create the loading dialog
  //     const dialogConfig = new MatDialogConfig();
  //     dialogConfig.disableClose = true;
  //     dialogConfig.autoFocus = true;
  //
  //     // Show the loading dialog
  //     this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);
  //   }
  // };
  //
  // // Closes the loading dialog
  // closeLoadingDialog(){
  //   // Only try to close if dialog ref defined
  //   if(this.loadingDialogRef){
  //     // Close the loading dialog
  //     this.loadingDialogRef.close();
  //
  //     // Nullify the ref
  //     this.loadingDialogRef = null;
  //   }
  // }
}
