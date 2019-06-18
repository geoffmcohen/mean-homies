import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomiesService {

  constructor(
    private http: HttpClient
  ) { }

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

  // Gets the pending  and waiting homie requests for a user
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
}
