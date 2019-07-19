import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
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

  public isMobile: boolean;
  public isBaseClass: boolean = this.constructor.name == "ConversationViewComponent";
  public loggedInUser: string;
  public conversationWithUser: string;
  public profileImage: string;

  private messengerDialogRef: MatDialogRef<MessengerDialogComponent>;
  private profileDialogRef: MatDialogRef<ProfileViewDialogComponent>;

  constructor(
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = appStateService.getIsMobile();
  }

  ngOnInit() {
    if(!this.isBaseClass){
      // Set the logged in user
      this.loggedInUser = this.authService.getUser();

      // Get the user that this conversation is with
      this.conversationWithUser = this.latestMessage.sendUser == this.loggedInUser ? this.latestMessage.receiveUser : this.latestMessage.sendUser;

      // Get profile image for desktop only
      if(!this.isMobile){
        // Set the profile image to the default
        this.profileImage = '../../../assets/images/default profile.gif';

        // Get the users profile image
        this.userService.getUserProfilePicture(this.authService.getUserToken(), this.conversationWithUser, (res : any) => {
          if(res.success) this.profileImage = res.imageUrl;
        });
      }
    }
  }

  // Opens the messenger dialog to allow for messaging
  openConversation(){
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

  // Displays the profile dialog
  showProfileDialog(){
    // Create the profile display dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {profile: this.profile};

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    } else {
      dialogConfig.minWidth = "90%";
    }

    // Show the profile dislay dialog
    this.profileDialogRef = this.dialog.open(ProfileViewDialogComponent, dialogConfig);
  }

  // Sets the button color based on the message information
  getOpenMessageButtonColor(){
    if(this.latestMessage.sendUser == this.profile.username && this.latestMessage.status == 'sent'){
      return "accent";
    } else {
      return "primary";
    }
  }

  // Sets the button text based on the message information
  getOpenMessageButtonText(){
    if(this.latestMessage.sendUser == this.profile.username){
      if(this.latestMessage.status == 'sent'){
        return "Open Message";
      } else {
        return "Send Reply";
      }
    } else {
      return "View Conversation";
    }
  }

  // Sets the button icon based on the message information
  getOpenMessageButtonIcon(){
    if(this.latestMessage.sendUser == this.profile.username){
      if(this.latestMessage.status == 'sent'){
        return "email";
      } else {
        return "reply";
      }
    } else {
      return "forum";
    }
  }
}
