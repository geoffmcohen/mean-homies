import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Subscription } from 'rxjs';
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { MessagesService } from '../messages.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-messenger-dialog',
  templateUrl: './messenger-dialog.component.html',
  styleUrls: ['./messenger-dialog.component.css']
})
export class MessengerDialogComponent implements OnInit, OnDestroy {
  public isMobile: boolean;
  public profile: any;
  public profileImage: string;
  public messages: any[];
  public errorMessage: string;
  public sendDisabled: boolean;
  private lastMessageTime: number;
  private needsToScrollToBottom: boolean;
  private newMessageSubscription: Subscription;
  private readMessageSubscription: Subscription;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  newMessage = new FormControl('', []);

  constructor(
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private msgService: MessagesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MessengerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = appStateService.getIsMobile();

    // Gets the profile from input data
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

        // Scroll to the bottom after the view is checked
        this.needsToScrollToBottom = true;

        // Now subscribe to get new messages
        this.subscribeToNewMessages();
      }

      // Hide the loading dialog
      this.closeLoadingDialog();
    });
  }

  // Keep the messages scrolled to the bottom
  ngAfterViewChecked(){
    // Scroll to the bottom if neccessary
    if(this.needsToScrollToBottom) this.scrollToBottom();
  }

  // Unsubscribe from observables when the dialog is closed
  ngOnDestroy(){
    this.newMessageSubscription.unsubscribe();
    this.readMessageSubscription.unsubscribe();
  }

  // Subscribe to message changes
  subscribeToNewMessages(){
    // Get latest messages
    this.newMessageSubscription = this.msgService.newMessageFrom.subscribe(sendUser => {
      // Get new messages if it was this user who sent a message
      if(sendUser == this.profile.username){
        this.getLatestMessages();
      }
    });

    // Mark messages as read
    this.readMessageSubscription = this.msgService.messageMarkedAsRead.subscribe(updateData => {
      if(updateData.receiveUser == this.profile.username){
        // Loop through the messages backwards to find the mesasage to mark as read
        for(var i = this.messages.length - 1; i >= 0; i--){
          if(this.messages[i].sendTimestamp == updateData.sendTimestamp && this.messages[i].sendUser == updateData.sendUser){
            this.messages[i].readTimestamp = updateData.readTimestamp;
            this.messages[i].status = updateData.status;
            break;
          }
        }
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

        // Scroll to the bottom after the view is checked
        this.needsToScrollToBottom = true;
      }
    });
  }

  // Scroll the messages to the bottom
  scrollToBottom(){
    // Scroll the messages to the bottom
    var messagesDiv = document.getElementById("messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight - messagesDiv.clientHeight;

    // Reset the flag to let it know that we need to scroll to the bottom
    this.needsToScrollToBottom = false;
  }
}
