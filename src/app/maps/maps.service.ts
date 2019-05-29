import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(
    private http: HttpClient
  ) { }

  // Tries to Geocode the input address using Google api
  public findLocation(
    address: string,
    callback: ((result: any) => void)
  ) : void{
    // Set up the parameters
    var params = new HttpParams()
      .set('address', address)
      .set('key', environment.google_geocoder_key);

    // Make the REST call
    this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {params}).subscribe((res: any) => {
      // Send the results back to callback
      callback(res);
    });
  }
}
