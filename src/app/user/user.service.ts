import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    username: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/user/get_profile', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Saves the users profile
  public saveUserProfile(
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
      callback(res);
    });
  }

  // Gets the users profile picture
  public getUserProfilePicture(
    username: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('username', username);

    // Make the REST call
    this.http.get<any>('/api/user/get_profile_picture', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Uploads the users profile picture
  public uploadUserProfilePicture(
    username: string,
    imageFile: File,
    callback: ((result: any) => void)
  ) : void{
    // Create form data to hold parameters
    var formData = new FormData();
    formData.append('username', username);
    formData.append('imageFile', imageFile, imageFile.name);

    // Make the rest call to upload the profile picture
    this.http.post<any>('api/user/upload_profile_picture', formData).subscribe((res : any) => {
      callback(res);
    });
  }
}
