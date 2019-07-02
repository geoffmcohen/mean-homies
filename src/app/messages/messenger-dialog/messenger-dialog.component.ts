import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { MessagesService } from '../messages.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-messenger-dialog',
  templateUrl: './messenger-dialog.component.html',
  styleUrls: ['./messenger-dialog.component.css']
})
export class MessengerDialogComponent implements OnInit {
  public profile: any;
  public profileImage: string;
  public messages: any[];
  public errorMessage: string;
  public sendDisabled: boolean;
  private lastMessageTime: number;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  newMessage = new FormControl('', []);

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private msgService: MessagesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MessengerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.profile = data.profile;
  }

  ngOnInit() {
    // Start at the begining of time to get messages
    this.lastMessageTime = 0;

    // Set the profile image to the default
    this.profileImage = '../../../assets/images/default profile.gif';

    this.userService.getUserProfilePicture(this.authService.getUserToken(), this.profile.username, (res : any) => {
      if(res.success) this.profileImage = res.imageUrl;
    });

    // Show the loading dialog
    this.showLoadingDialog();

    // Get the messages in the conversation
    this.msgService.getMessages(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, this.lastMessageTime, (res : any) => {
      if(res.success){
        // Set the messages
        this.messages = res.messages;

        // Update the last message time to the last messages send time
        if(this.messages.length){
          this.lastMessageTime = this.messages[this.messages.length-1].sendTimestamp;
        }

        // Now subscribe to get new messages
        this.subscribeToNewMessages();
      }

      // Hide the loading dialog
      this.closeLoadingDialog();
    });
  }

  // Subscribe to message changes
  subscribeToNewMessages(){
    this.msgService.newMessageFrom.subscribe(sendUser => {
      // Get new messages if it was this user who sent a message
      if(sendUser == this.profile.username){
        this.getLatestMessages();
      }
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

  // Closes the dialog
  close(){
    this.dialogRef.close();
  }

  // Sends a new message
  sendMessage(){
    // Disable the message box and send button
    this.sendDisabled = true;

    // Send the message
    this.msgService.sendMessage(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, this.newMessage.value, (res : any) => {
        if(res.success){
          // Clear out the message box
          this.newMessage.setValue("");

          // Get new messages
          this.getLatestMessages();
        } else {
          this.errorMessage = res.message;
        }

        // Enable message box and send button
        this.sendDisabled = false;
    });
  }

  // Gets the newest messages in the conversation
  getLatestMessages(){
    // Get the messages in the conversation
    this.msgService.getMessages(this.authService.getUserToken(), this.authService.getUser(), this.profile.username, this.lastMessageTime, (res : any) => {
      if(res.success){
        // Add any new messages to the messages
        this.messages = this.messages.concat(res.messages);

        // Update the last message time to the last messages send time
        if(this.messages.length){
          this.lastMessageTime = this.messages[this.messages.length-1].sendTimestamp;
        }

        // #TODO: We need to make the messages auto scroll to the end
      }
    });
  }
}
