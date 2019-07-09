import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  // Output to allow components to subscribe to hasActiveProfile
  @Output() hasActiveProfileChange: EventEmitter<boolean> = new EventEmitter();

  // Creates a new user
  public createUser(
    email: string,
    username: string,
    password: string,
    callback: ((result: any) => void)
  ) : void{
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
  ) : void{
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
  ) : void{
    // Make the REST call
    this.http.post<any>('/api/user/reset_password', {email: email, newPassword: newPassword, token: token}).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Changes users password
  public changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
    this.http.post<any>('/api/user/change_password', {username: username, oldPassword: oldPassword, newPassword: newPassword}).subscribe((res : any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Gets the user profile
  public getUserProfile(
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
    this.http.get<any>('/api/user/get_profile', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }


  // Gets multiple user profiles
  public getUserProfiles(
    token: string,
    username: string,
    users: string[],
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username)
      .set('usersString', users.join(','));

    // Make the REST call
    this.http.get<any>('/api/user/get_profiles', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Saves the users profile
  public saveUserProfile(
    token: string,
    username: string,
    displayName: string,
    aboutMe: string,
    lookingToMeet: string,
    location: string,
    lat: number,
    lng: number,
    city: string,
    stateProvince: string,
    country: string,
    callback: ((result: any) => void)
  ) : void{
    // Make the REST call
      // Send the results back to callback
      this.http.post<any>('/api/user/save_profile', {
        token: token,
        username: username,
        displayName: displayName,
        aboutMe: aboutMe,
        lookingToMeet: lookingToMeet,
        location: location,
        lat: lat,
        lng: lng,
        city: city,
        stateProvince: stateProvince,
        country: country
      }).subscribe((res: any) => {
      // Emit the value of whether the profile is active
      this.hasActiveProfileChange.emit(res.isActive);

      // Return results back to caller
      callback(res);
    });
  }

  // Gets the users profile picture
  public getUserProfilePicture(
    token: string,
    username: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/user/get_profile_picture', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Uploads the users profile picture
  public uploadUserProfilePicture(
    token: string,
    username: string,
    imageFile: File,
    callback: ((result: any) => void)
  ) : void{
    // Create form data to hold parameters
    var formData = new FormData();
    formData.append('token', token);
    formData.append('username', username);
    formData.append('imageFile', imageFile, imageFile.name);

    // Make the rest call to upload the profile picture
    this.http.post<any>('api/user/upload_profile_picture', formData).subscribe((res : any) => {
      callback(res);
    });
  }

  // Returns if the user has an active profile
  public hasActiveProfile(
    token: string,
    username: string,
    callback: ((isActive: boolean) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/user/has_active_profile', {params}).subscribe((res: any) => {
      // Emit any change to the profile activeness
      this.hasActiveProfileChange.emit(res.isActive);

      // Send the results back to callback
      callback(res.isActive);
    });
  }

  // Gets the users preferences
  public getUserPreferences(
    token: string,
    username: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/user/get_user_preferences', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Saves the users preferences
  public saveUserPreferences(
    token: string,
    username: string,
    sendNewMessageEmail: boolean,
    sendHomieRequestReceiveEmail: boolean,
    sendHomieRequestAcceptEmail: boolean,
    callback: ((result: any) => void)
  ) : void{

  }
}
