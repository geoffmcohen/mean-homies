import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private adminUser: string;
  private adminToken: string;

  constructor(private http: HttpClient) { }

  // Function to attempt to login an admin user
  public adminLogin(
    username: string,
    password: string,
    callback: ((result: any) => void)
    ) : void{
    console.log("adminLogin called for %s", username);

    // Make the REST call
    this.http.post<any>(
      '/api/admin/login',
      {username: username, password: password},
    ).subscribe((res : any) => {

        // Store the user and token if successful
        if(res.success){
          this.adminUser = username;
          this.adminToken = res.token;
        } else {
          this.adminUser = null;
          this.adminToken = null;
        }

        // Send the results back to the callback
        callback(res);
    });
  }

  // Log the admin user out
  public adminLogout(){
    this.adminUser = null;
    this.adminToken = null;
  }

  // Getter for admin user`
  public getAdminUser() : string {
    return this.adminUser;
  }

  // Getter for admin adminToken
  public getAdminToken() : string {
      return this.adminToken;
  }

  // Function to determine if the admin user is logged in
  public checkAdminIsLoggedIn() : boolean {
    if(this.adminUser && this.adminToken) {
      // Make a call to verify the token is still valid
      this.http.post<any>('/api/admin/verify_user', {token: this.adminToken}).subscribe((res : any) => {
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

}
