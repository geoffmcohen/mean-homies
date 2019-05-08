import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

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
          this.cookieService.set('admin-user', username);
          this.cookieService.set('admin-token', res.token);
        } else {
          this.cookieService.delete('admin-user');
          this.cookieService.delete('admin-token');
        }

        // Send the results back to the callback
        callback(res);
    });
  }

  // Log the admin user out
  public adminLogout(){
    this.cookieService.delete('admin-user');
    this.cookieService.delete('admin-token');
  }

  // Getter for admin user
  public getAdminUser() : string {
    return this.cookieService.get('admin-user');
  }

  // Getter for admin adminToken
  public getAdminToken() : string {
      return this.cookieService.get('admin-token');
  }

  // Function to determine if the admin user is logged in
  public checkAdminIsLoggedIn() : boolean {
    if(this.getAdminUser() && this.getAdminToken()) {
      // Make a call to verify the token is still valid
      this.http.post<any>('/api/admin/verify_user', {token: this.getAdminToken()}).subscribe((res : any) => {
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
