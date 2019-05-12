import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { BlogService } from '../../blog/blog.service';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-new-blog-post',
  templateUrl: './new-blog-post.component.html',
  styleUrls: ['./new-blog-post.component.css']
})
export class NewBlogPostComponent implements OnInit {
  public title: string;
  public body: string;
  public image_filename: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private blogService: BlogService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  // Call when post button is clicked
  post(){
    console.log('Post clicked.');

    // Display the loading dialog
    this.showLoadingDialog();

    // Make call to service here
    this.blogService.createBlogPost(
      this.authService.getAdminToken(),
      this.authService.getAdminUser(),
      this.title,
      this.body,
      (res : any) => {
        // If posted clear the fields
        if(res.success) {
          this.clearFields();
        }

        // Add snackbar with result
        console.log(res);
        
        // Hide the loading dialog
        this.closeLoadingDialog();
      });
  }

  onFileChange(event){
    console.log('File changed');
  }

  clearSelectedFile(){
    console.log('Image file removed');
    this.image_filename = null;
  }

  // Displays a loading dialog
  showLoadingDialog(){
    // Create the loading dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Show the loading dialog
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);
  };

  // Closes the loading dialog
  closeLoadingDialog(){
    this.loadingDialogRef.close();
  }

  // Clears all of the fields
  clearFields(){
    this.title = null;
    this.body = null;
    this.clearSelectedFile();
  }
}
