import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  // Creates a new user
  public createUser(
    email: string,
    username: string,
    password: string,
    callback: ((result: any) => void)
  ) :  void{
    // Make the REST call
    this.http.post<any>(
      '/api/user/create_user',
      {email: email, username: username, password: password}
    ).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Checks to see if an email address is taken
  public checkIfEmailIsTaken(
    email: string,
  ): Observable<any>{
    return this.http.post<any>('api/user/is_email_taken', {email: email});
  }

  // Checks to see if an username is taken
  public checkIfUsernameIsTaken(
    username: string,
  ): Observable<any>{
    return this.http.post<any>('api/user/is_username_taken', {username: username});
  }

  // Requests a password reset for the given email
  public requestPasswordReset(
    email: string,
    callback: ((result: any) => void)
  ) :  void{
    // Make the REST call
    this.http.post<any>('/api/user/request_password_reset', {email: email}).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Resets users password
  public resetPassword(
    email: string,
    newPassword: string,
    token: string,
    callback: ((result: any) => void)
  ) :  void{
    // Make the REST call
    this.http.post<any>('/api/user/reset_password', {email: email, newPassword: newPassword, token: token}).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }


}
