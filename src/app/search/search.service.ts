import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient
  ) { }

  // Calls the api to get user profiles near the user
  public searchForUsersNearUser(
      token: string,
      username: string,
      radius: number,
      useMiles: boolean,
      callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username)
      .set('radius', String(radius))
      .set('useMiles', String(useMiles));

    // Make the REST call
    this.http.get<any>('/api/search/get_users_near_user', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

  // Calls the api to find user profiles near the user input location
  searchForUsersNearLocation(
    token: string,
    username: string,
    location: string,
    radius: number,
    useMiles: boolean,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('token', token)
      .set('username', username)
      .set('location', location)
      .set('radius', String(radius))
      .set('useMiles', String(useMiles));

    // Make the REST call
    this.http.get<any>('/api/search/get_users_near_location', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }

}
