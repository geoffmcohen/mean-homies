/*
This file will be replacing app-routing.module.ts for production in
angular.json, until I am ready to launch the site.  This will allow us
to hide everything that is unser construction.
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { AdminComponent } from './admin/admin.component';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home/home.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';
import { DefaultComponent } from './home/default/default.component';
import { AboutComponent } from './home/about/about.component';
import { FaqComponent } from './home/faq/faq.component';
import { ContactComponent } from './home/contact/contact.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { SearchComponent } from './search/search/search.component';
import { HomiesComponent } from './homies/homies/homies.component';
import { MessageCenterComponent } from './messages/message-center/message-center.component';
import { TermsOfServiceComponent } from './terms/terms-of-service/terms-of-service.component';

const routes: Routes = [
  {path: '', component: ComingSoonComponent}, // Replace with commented out redirect
  {path: 'about', component: AboutComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'terms-of-service', component: TermsOfServiceComponent},
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent,
    children: [
      {path: '', component: DefaultComponent, pathMatch: 'full'},
      {path: 'about', component: AboutComponent},
      {path: 'faq', component: FaqComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'user/edit-profile', component: EditProfileComponent},
      {path: 'search', component: SearchComponent},
      {path: 'homies', component: HomiesComponent},
      {path: 'messages', component: MessageCenterComponent},
      {path: 'terms-of-service', component: TermsOfServiceComponent}
    ]
  },
  {path: 'blog', component: BlogComponent},
  {path: 'blog/page/:pageNumber', component: BlogComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'user/password-reset/:resetToken', component: PasswordResetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
