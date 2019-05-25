import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(
    private http: HttpClient
  ) { }

  // Output to allow components to subscribe to login info
  @Output() userLoginChange: EventEmitter<boolean> = new EventEmitter();

  // Function to attempt to login an admin user
  public adminLogin(
    username: string,
    password: string,
    callback: ((result: any) => void)
    ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/admin/login',
      {username: username, password: password},
    ).subscribe((res : any) => {
        // Store the user and token if successful
        if(res.success){
          cookies.set('admin-user', username);
          cookies.set('admin-token', res.token);
        } else {
          this.adminLogout();
        }

        // Send the results back to the callback
        callback(res);
    });
  }

  // Log the admin user out
  public adminLogout(){
    cookies.remove('admin-user');
    cookies.remove('admin-token');
  }

  // Getter for admin user
  public getAdminUser() : string {
    return cookies.get('admin-user');
  }

  // Getter for admin adminToken
  public getAdminToken() : string {
      return cookies.get('admin-token');
  }

  // Function to determine if the admin user is logged in
  public checkAdminIsLoggedIn() : boolean {
    if(this.getAdminUser() && this.getAdminToken()) {
      // Make a call to verify the token is still valid
      this.http.post<any>('/api/admin/verify_user', {
        token: this.getAdminToken(),
        username: this.getAdminUser()
      }).subscribe((res : any) => {
        // If token is no longer valid call adminLogout()
        if(!res.success){
          this.adminLogout();
        }
      });

      // Return true for now, backend services will still check the token before doing anything
      return true;
  } else {
      return false;
    }
  }

  // Function to attempt to login the user
  public userLogin(
    username: string,
    password: string,
    callback: ((result: any) => void)
    ) : void{
    // Make the REST call
    this.http.post<any>(
      '/api/user/login',
      {username: username, password: password},
    ).subscribe((res : any) => {
        // Store the user and token if successful
        if(res.success){
          cookies.set('user', res.actualUsername);
          cookies.set('user-token', res.token);
          this.userLoginChange.emit(true);
        } else {
          this.userLogout();
        }

        // Send the results back to the callback
        callback(res);
    });
  }

  // Log the user out
  public userLogout(){
    cookies.remove('user');
    cookies.remove('user-token');
    this.userLoginChange.emit(false);
  }

  // Getter for user
  public getUser() : string {
    return cookies.get('user');
  }

  // Getter for user token
  public getUserToken() : string {
      return cookies.get('user-token');
  }

  // Function to determine if the user is logged in
  public checkUserIsLoggedIn() : boolean {
    if(this.getUser() && this.getUserToken()) {
      // Make a call to verify the token is still valid
      this.http.post<any>('/api/user/verify_user', {
        token: this.getUserToken(),
        username: this.getUser()
      }).subscribe((res : any) => {
        // If token is no longer valid call userLogout()
        if(!res.success){
          this.userLogout();
        }
      });

      // Return true for now, backend services will still check the token before doing anything
      return true;
    } else {
      return false;
    }
  }
}
