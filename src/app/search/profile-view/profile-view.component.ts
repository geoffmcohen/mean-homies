import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  @Input() profile: any;
  public profileImage: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    // Set the profile image to the default
    this.profileImage = '../../../assets/images/default profile.gif';

    // Make the call to actually get the users profile Picture
    this.userService.getUserProfilePicture(this.authService.getUserToken(), this.profile.username, (res : any) => {
      if(res.success) this.profileImage = res.imageUrl;
    });
  }
}
