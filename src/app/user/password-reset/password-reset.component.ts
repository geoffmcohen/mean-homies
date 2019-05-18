import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  private resetToken: string;
  public isTokenValid: boolean;
  public message: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the resetToken from parameters
    this.route.params.subscribe(params => {
      if (params['resetToken']) {
        this.resetToken = params['resetToken'];

        // Now check if token is vailid
        // If so we'll set the isTokenValid to trigger display of reset form
        this.isTokenValid = true;

      } else {
        // If no token, we'll need to display something
        this.message = "";
      }
    });
  }

  // Submission of reset form
  resetPassword(){
    // Call service to reset the password and provide a message

  }
}
