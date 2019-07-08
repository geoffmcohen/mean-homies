import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { AuthenticationService } from '../auth/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  public unreadMessageCount: number;

  // Event emitters to notify components of changes
  @Output() unreadMessageCountChange: EventEmitter<number> = new EventEmitter();
  @Output() newMessageFrom: EventEmitter<string> = new EventEmitter();
  @Output() newMessageTo: EventEmitter<string> = new EventEmitter();
  @Output() newMessageInfo: EventEmitter<any> = new EventEmitter();
  @Output() messageMarkedAsRead: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    // If a user is logged in set up connection to real time notification socket
    if(authService.getUser()){
      // Get the number of unread messages for the user
      this.getUnreadMessageCount(this.authService.getUserToken(), this.authService.getUser(), (res : any) => {});

      // Create a socket to check for message updates
      const socket = socketIo('');

      // When a new message has been sent
      socket.on('new message', msgInfo => {
        // If the user is the recipient
        if(authService.getUser() == msgInfo.receiveUser){
          // Increment count of unread messages and emit
          this.unreadMessageCountChange.emit(++this.unreadMessageCount);

          // Also emit the senders name so we can refresh any open convo with them
          this.newMessageFrom.emit(msgInfo.sendUser);
        } else if(authService.getUser() == msgInfo.sendUser){
          // If the user sent the message emit something to let the message center know to update the screen
          this.newMessageTo.emit(msgInfo.receiveUser);
        }

        // If the user is either user emit the message details as well
        if(authService.getUser() == msgInfo.receiveUser || authService.getUser() == msgInfo.sendUser){
          this.newMessageInfo.emit(msgInfo);
        }
      });

      // When a message has been marked as read
      socket.on('message marked as read', updatedMessage => {
        if(authService.getUser() == updatedMessage.sendUser){
          // Let the sender know the message has been read so it can be displayed
          this.messageMarkedAsRead.emit(updatedMessage);
        } else if (authService.getUser() == updatedMessage.receiveUser){
          // Let the receiver also know that the message has been read
          this.messageMarkedAsRead.emit(updatedMessage);

          // Decrement count of unread messages and emit
          this.unreadMessageCountChange.emit(--this.unreadMessageCount);
        }
      });
      //});
    }
  }

  // Sends a new message to the target user
  public sendMessage(
    token: string,
    username: string,
    targetUser: string,
    messageText: string,
    callback: ((result : any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/messages/send_message',
      {token: token, username: username, targetUser: targetUser, messageText: messageText}
    ).subscribe((res : any) => {
      // Send the results back to the callback
      callback(res);
    });
  }

  // Gets the messages in the conversation
  public getMessages(
    token: string,
    username: string,
    targetUser: string,
    startTime: number,
    callback: ((result : any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username)
      .set('targetUser', targetUser)
      .set('startTime', String(startTime));

    // Make the REST call
    this.http.get<any>('/api/messages/get_messages', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Gets the number of unread messages for the user from api, stores it in service and returns the value via callback
  public getUnreadMessageCount(
    token: string,
    username: string,
    callback: ((result : any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/messages/get_unread_message_count', {params}).subscribe((res: any) => {
      // Set the local unread message count
      if(res.success){
        this.unreadMessageCount = res.count;
      }

      // Send the results back to the callback
      callback(res);
    });
  }

  // Gets the latest messages in all user conversations
  public getLatestMessages(
    token: string,
    username: string,
    callback: ((result : any) => void)
  ) : void {
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/messages/get_latest_messages', {params}).subscribe((res: any) => {
      // Send the results back to the callback
      callback(res);
    });
  }

  // Gets a specific message
  public getMessage(
    token: string,
    username: string,
    sendUser: string,
    receiveUser: string,
    sendTimestamp: number,
    markAsRead: boolean,
    callback: ((result : any) => void)
  ) : void {
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username)
      .set('sendUser', sendUser)
      .set('receiveUser', receiveUser)
      .set('sendTimestamp', String(sendTimestamp))
      .set('markAsRead', String(markAsRead));

    // Make the REST call
    this.http.get<any>('/api/messages/get_message', {params}).subscribe((res: any) => {
      // Send the results back to the callback
      callback(res);
    });
  }
}
