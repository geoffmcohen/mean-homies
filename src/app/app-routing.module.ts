import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { AdminComponent } from './admin/admin.component';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';

const routes: Routes = [
  // Replace default path with HomeComponent when ready to launch
  {path: '', component: ComingSoonComponent},
  {path: 'test', component: HomeComponent},
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
