import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatDividerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatTabsModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { BlogPostComponent } from './blog/blog-post/blog-post.component';
import { BlogPageNavigationComponent } from './blog/blog-page-navigation/blog-page-navigation.component';
import { AdminTopComponent } from './admin/admin-top/admin-top.component';
import { AdminMenuComponent } from './admin/admin-menu/admin-menu.component';
import { AdminUserAreaComponent } from './admin/admin-user-area/admin-user-area.component';
import { NewBlogPostComponent } from './admin/new-blog-post/new-blog-post.component';
import { ReportComponent } from './admin/report/report.component';
import { AdminLoginDialogComponent } from './admin/admin-login-dialog/admin-login-dialog.component';
import { LoadingDialogComponent } from './shared/loading-dialog/loading-dialog.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';
import { HomeUserAreaComponent } from './home/home-user-area/home-user-area.component';
import { LoginDialogComponent } from './user/login-dialog/login-dialog.component';
import { SignupDialogComponent } from './user/signup-dialog/signup-dialog.component';
import { ResetPasswordDialogComponent } from './user/reset-password-dialog/reset-password-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    BlogComponent,
    HomeComponent,
    BlogPostComponent,
    BlogPageNavigationComponent,
    AdminTopComponent,
    AdminMenuComponent,
    AdminUserAreaComponent,
    NewBlogPostComponent,
    ReportComponent,
    AdminLoginDialogComponent,
    LoadingDialogComponent,
    ComingSoonComponent,
    PasswordResetComponent,
    HomeUserAreaComponent,
    LoginDialogComponent,
    SignupDialogComponent,
    ResetPasswordDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminLoginDialogComponent,
    LoadingDialogComponent,
    LoginDialogComponent,
    SignupDialogComponent,
    ResetPasswordDialogComponent
  ]
})
export class AppModule { }
