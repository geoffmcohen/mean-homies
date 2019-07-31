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
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { SearchComponent } from './search/search/search.component';
import { HomiesComponent } from './homies/homies/homies.component';
import { MessageCenterComponent } from './messages/message-center/message-center.component';

const routes: Routes = [
  {path: 'coming-soon', component: ComingSoonComponent},
  {path: 'about', component: AboutComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent,
    children: [
      {path: '', component: DefaultComponent, pathMatch: 'full'},
      {path: 'about', component: AboutComponent},
      {path: 'faq', component: FaqComponent},
      {path: 'user/edit-profile', component: EditProfileComponent},
      {path: 'search', component: SearchComponent},
      {path: 'homies', component: HomiesComponent},
      {path: 'messages', component: MessageCenterComponent}
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
