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
  MatTabsModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatBadgeModule,
  MatExpansionModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
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
import { UserAgreementDialogComponent } from './user/user-agreement-dialog/user-agreement-dialog.component';
import { ChangePasswordDialogComponent } from './user/change-password-dialog/change-password-dialog.component';
import { AboutComponent } from './home/about/about.component';
import { FaqComponent } from './home/faq/faq.component';
import { DefaultComponent } from './home/default/default.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { UnavailableFeatureComponent } from './shared/unavailable-feature/unavailable-feature.component';
import { PictureUploadDialogComponent } from './user/picture-upload-dialog/picture-upload-dialog.component';
import { SearchComponent } from './search/search/search.component';
import { ProfileViewComponent } from './search/profile-view/profile-view.component';
import { ProfileViewDialogComponent } from './user/profile-view-dialog/profile-view-dialog.component';
import { CreateHomieRequestDialogComponent } from './homies/create-homie-request-dialog/create-homie-request-dialog.component';
import { HomiesComponent } from './homies/homies/homies.component';
import { HomieRequestComponent } from './homies/homie-request/homie-request.component';
import { HomieViewComponent } from './homies/homie-view/homie-view.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';

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
    ResetPasswordDialogComponent,
    UserAgreementDialogComponent,
    ChangePasswordDialogComponent,
    AboutComponent,
    FaqComponent,
    DefaultComponent,
    EditProfileComponent,
    UnavailableFeatureComponent,
    PictureUploadDialogComponent,
    SearchComponent,
    ProfileViewComponent,
    ProfileViewDialogComponent,
    CreateHomieRequestDialogComponent,
    HomiesComponent,
    HomieRequestComponent,
    HomieViewComponent,
    ConfirmationDialogComponent
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
    MatTabsModule, // Not currently using
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatBadgeModule,
    MatExpansionModule,
    AgmCoreModule.forRoot({apiKey: environment.google_maps_key})
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminLoginDialogComponent,
    LoadingDialogComponent,
    LoginDialogComponent,
    SignupDialogComponent,
    ResetPasswordDialogComponent,
    UserAgreementDialogComponent,
    ChangePasswordDialogComponent,
    PictureUploadDialogComponent,
    ProfileViewDialogComponent,
    CreateHomieRequestDialogComponent,
    ConfirmationDialogComponent
  ]
})
export class AppModule { }
