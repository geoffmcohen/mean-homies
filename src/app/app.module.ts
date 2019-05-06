import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
import { ModalDialogComponent } from './shared/modal-dialog/modal-dialog.component';

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
    ModalDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
