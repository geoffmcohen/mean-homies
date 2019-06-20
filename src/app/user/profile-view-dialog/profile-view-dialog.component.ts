import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-view-dialog',
  templateUrl: './profile-view-dialog.component.html',
  styleUrls: ['./profile-view-dialog.component.css']
})
export class ProfileViewDialogComponent implements OnInit {
  public profile: any;
  public profileImage: string;

  constructor(
    private dialogRef: MatDialogRef<ProfileViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.profile = data.profile;
  }

  ngOnInit() {
  }

  // Closes the dialog
  close(){
    this.dialogRef.close();
  }

}
