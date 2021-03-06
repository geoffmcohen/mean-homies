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
import { HomeComponent } from './home/home/home.component';
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
import { MessengerDialogComponent } from './messages/messenger-dialog/messenger-dialog.component';
import { MessageCenterComponent } from './messages/message-center/message-center.component';
import { ConversationViewComponent } from './messages/conversation-view/conversation-view.component';
import { UserPreferencesDialogComponent } from './user/user-preferences-dialog/user-preferences-dialog.component';
import { HomeDesktopComponent } from './home/home/home-desktop/home-desktop.component';
import { HomeMobileComponent } from './home/home/home-mobile/home-mobile.component';
import { UserAgreementDialogMobileComponent } from './user/user-agreement-dialog/user-agreement-dialog-mobile/user-agreement-dialog-mobile.component';
import { UserAgreementDialogDesktopComponent } from './user/user-agreement-dialog/user-agreement-dialog-desktop/user-agreement-dialog-desktop.component';
import { SignupDialogDesktopComponent } from './user/signup-dialog/signup-dialog-desktop/signup-dialog-desktop.component';
import { SignupDialogMobileComponent } from './user/signup-dialog/signup-dialog-mobile/signup-dialog-mobile.component';
import { LoginDialogDesktopComponent } from './user/login-dialog/login-dialog-desktop/login-dialog-desktop.component';
import { LoginDialogMobileComponent } from './user/login-dialog/login-dialog-mobile/login-dialog-mobile.component';
import { ResetPasswordDialogMobileComponent } from './user/reset-password-dialog/reset-password-dialog-mobile/reset-password-dialog-mobile.component';
import { ResetPasswordDialogDesktopComponent } from './user/reset-password-dialog/reset-password-dialog-desktop/reset-password-dialog-desktop.component';
import { PasswordResetMobileComponent } from './user/password-reset/password-reset-mobile/password-reset-mobile.component';
import { PasswordResetDesktopComponent } from './user/password-reset/password-reset-desktop/password-reset-desktop.component';
import { ChangePasswordDialogMobileComponent } from './user/change-password-dialog/change-password-dialog-mobile/change-password-dialog-mobile.component';
import { ChangePasswordDialogDesktopComponent } from './user/change-password-dialog/change-password-dialog-desktop/change-password-dialog-desktop.component';
import { UserPreferencesDialogMobileComponent } from './user/user-preferences-dialog/user-preferences-dialog-mobile/user-preferences-dialog-mobile.component';
import { UserPreferencesDialogDesktopComponent } from './user/user-preferences-dialog/user-preferences-dialog-desktop/user-preferences-dialog-desktop.component';
import { EditProfileMobileComponent } from './user/edit-profile/edit-profile-mobile/edit-profile-mobile.component';
import { EditProfileDesktopComponent } from './user/edit-profile/edit-profile-desktop/edit-profile-desktop.component';
import { PictureUploadDialogMobileComponent } from './user/picture-upload-dialog/picture-upload-dialog-mobile/picture-upload-dialog-mobile.component';
import { PictureUploadDialogDesktopComponent } from './user/picture-upload-dialog/picture-upload-dialog-desktop/picture-upload-dialog-desktop.component';
import { SearchMobileComponent } from './search/search/search-mobile/search-mobile.component';
import { SearchDesktopComponent } from './search/search/search-desktop/search-desktop.component';
import { ProfileViewMobileComponent } from './search/profile-view/profile-view-mobile/profile-view-mobile.component';
import { ProfileViewDesktopComponent } from './search/profile-view/profile-view-desktop/profile-view-desktop.component';
import { CreateHomieRequestDialogMobileComponent } from './homies/create-homie-request-dialog/create-homie-request-dialog-mobile/create-homie-request-dialog-mobile.component';
import { CreateHomieRequestDialogDesktopComponent } from './homies/create-homie-request-dialog/create-homie-request-dialog-desktop/create-homie-request-dialog-desktop.component';
import { ProfileViewDialogMobileComponent } from './user/profile-view-dialog/profile-view-dialog-mobile/profile-view-dialog-mobile.component';
import { ProfileViewDialogDesktopComponent } from './user/profile-view-dialog/profile-view-dialog-desktop/profile-view-dialog-desktop.component';
import { HomiesMobileComponent } from './homies/homies/homies-mobile/homies-mobile.component';
import { HomiesDesktopComponent } from './homies/homies/homies-desktop/homies-desktop.component';
import { HomieRequestMobileComponent } from './homies/homie-request/homie-request-mobile/homie-request-mobile.component';
import { HomieRequestDesktopComponent } from './homies/homie-request/homie-request-desktop/homie-request-desktop.component';
import { HomieViewMobileComponent } from './homies/homie-view/homie-view-mobile/homie-view-mobile.component';
import { HomieViewDesktopComponent } from './homies/homie-view/homie-view-desktop/homie-view-desktop.component';
import { MessengerDialogMobileComponent } from './messages/messenger-dialog/messenger-dialog-mobile/messenger-dialog-mobile.component';
import { MessengerDialogDesktopComponent } from './messages/messenger-dialog/messenger-dialog-desktop/messenger-dialog-desktop.component';
import { MessageCenterMobileComponent } from './messages/message-center/message-center-mobile/message-center-mobile.component';
import { MessageCenterDesktopComponent } from './messages/message-center/message-center-desktop/message-center-desktop.component';
import { ConversationViewMobileComponent } from './messages/conversation-view/conversation-view-mobile/conversation-view-mobile.component';
import { ConversationViewDesktopComponent } from './messages/conversation-view/conversation-view-desktop/conversation-view-desktop.component';
import { ContactComponent } from './home/contact/contact.component';
import { BanUserComponent } from './admin/ban-user/ban-user.component';
import { TermsOfServiceComponent } from './terms/terms-of-service/terms-of-service.component';

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
    ConfirmationDialogComponent,
    MessengerDialogComponent,
    MessageCenterComponent,
    ConversationViewComponent,
    UserPreferencesDialogComponent,
    HomeDesktopComponent,
    HomeMobileComponent,
    UserAgreementDialogMobileComponent,
    UserAgreementDialogDesktopComponent,
    SignupDialogDesktopComponent,
    SignupDialogMobileComponent,
    LoginDialogDesktopComponent,
    LoginDialogMobileComponent,
    ResetPasswordDialogMobileComponent,
    ResetPasswordDialogDesktopComponent,
    PasswordResetMobileComponent,
    PasswordResetDesktopComponent,
    ChangePasswordDialogMobileComponent,
    ChangePasswordDialogDesktopComponent,
    UserPreferencesDialogMobileComponent,
    UserPreferencesDialogDesktopComponent,
    EditProfileMobileComponent,
    EditProfileDesktopComponent,
    PictureUploadDialogMobileComponent,
    PictureUploadDialogDesktopComponent,
    SearchMobileComponent,
    SearchDesktopComponent,
    ProfileViewMobileComponent,
    ProfileViewDesktopComponent,
    CreateHomieRequestDialogMobileComponent,
    CreateHomieRequestDialogDesktopComponent,
    ProfileViewDialogMobileComponent,
    ProfileViewDialogDesktopComponent,
    HomiesMobileComponent,
    HomiesDesktopComponent,
    HomieRequestMobileComponent,
    HomieRequestDesktopComponent,
    HomieViewMobileComponent,
    HomieViewDesktopComponent,
    MessengerDialogMobileComponent,
    MessengerDialogDesktopComponent,
    MessageCenterMobileComponent,
    MessageCenterDesktopComponent,
    ConversationViewMobileComponent,
    ConversationViewDesktopComponent,
    ContactComponent,
    BanUserComponent,
    TermsOfServiceComponent
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
    ConfirmationDialogComponent,
    MessengerDialogComponent,
    UserPreferencesDialogComponent
  ]
})
export class AppModule { }
