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

}
