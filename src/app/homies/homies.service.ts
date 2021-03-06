import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HomiesService {

  // Event emitters to notify when changes to homies and homie requests occur
  @Output() pendingRequestCountChange: EventEmitter<number> = new EventEmitter();
  @Output() waitingRequestCountChange: EventEmitter<number> = new EventEmitter();
  @Output() removeUserFromHomies: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    // If a user is logged in set up connection to real time notification socket
    if(authService.getUser()){
      // Create a socket to check for changes in homies and homie requests
      const socket = socketIo('');

      // When the count of homie requests changes
      socket.on('homie request count change', response => {
        // If a user is loggedin, then check if the request was for them
        if(authService.getUser()){
          if(response.acceptUser == authService.getUser()){
            this.getUsersPendingHomieRequestCount(authService.getUserToken(), authService.getUser(), (success : boolean, count: number) => {
              if(success) this.pendingRequestCountChange.emit(count);
            });
          }
          else if(response.requestUser == authService.getUser()){
            this.getUsersWaitingHomieRequestCount(authService.getUserToken(), authService.getUser(), (success: boolean, count: number) => {
              if(success) this.waitingRequestCountChange.emit(count);
            })
          }
        }
      });

      // When a homie user removes another user from their homie list
      socket.on('homie removal', response => {
        // If a user is logged in, check if this request pertains to them
        if(authService.getUser()){
          if(response.user == authService.getUser()){
            this.removeUserFromHomies.emit(response.targetUser);
          } else if(response.targetUser == authService.getUser()){
            this.removeUserFromHomies.emit(response.user);
          }
        }
      });
    }
  }

  // Returns the relationship between two users
  public getHomieStatus(
    token: string,
    username: string,
    targetUser: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username)
      .set('targetUser', targetUser);

    // Make the REST call
    this.http.get<any>('/api/homies/get_homie_status', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Sends a Homie request to the target user
  public sendHomieRequest(
    token: string,
    username: string,
    targetUser: string,
    message: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/homies/send_homie_request',
      {token: token, username: username, targetUser: targetUser, message: message}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Accepts a Homie request from the target user
  public acceptHomieRequest(
    token: string,
    username: string,
    targetUser: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/homies/accept_homie_request',
      {token: token, username: username, targetUser: targetUser}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Declines a Homie request from the target user
  public declineHomieRequest(
    token: string,
    username: string,
    targetUser: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/homies/decline_homie_request',
      {token: token, username: username, targetUser: targetUser}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Gets the users homies
  public getUsersHomies(
    token: string,
    username: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/homies/get_users_homies', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Gets the pending and waiting homie requests for a user
  public getUsersHomieRequests(
    token: string,
    username: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/homies/get_users_homie_requests', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Gets number of pending homie requests for the user
  public getUsersPendingHomieRequestCount(
      token: string,
      username: string,
      callback: ((success: boolean, count: number) => void)
  ) : void{
    this.getUsersHomieRequests(token, username, (res : any) => {
      if(res.success){
        callback(res.success, res.homieRequests.pending.length);
      } else {
        callback(res.success, null);
      }
    });
  }

  // Gets number of waiting homie requests for the user
  public getUsersWaitingHomieRequestCount(
      token: string,
      username: string,
      callback: ((success: boolean, count: number) => void)
  ) : void{
    this.getUsersHomieRequests(token, username, (res : any) => {
      if(res.success){
        callback(res.success, res.homieRequests.waiting.length);
      } else {
        callback(res.success, null);
      }
    });
  }

  // Deletes a Homie request sent from the user to the target user
  public deleteHomieRequest(
    token: string,
    username: string,
    targetUser: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/homies/delete_homie_request',
      {token: token, username: username, targetUser: targetUser}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Removes the users homie relationship
  public removeHomie(
    token: string,
    username: string,
    targetUser: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/homies/remove_homie',
      {token: token, username: username, targetUser: targetUser}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Blocks a the target user from contacting this user
  public blockUser(
    token: string,
    username: string,
    targetUser: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/homies/block_user',
      {token: token, username: username, targetUser: targetUser}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }


}
