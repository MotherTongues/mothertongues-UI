import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarksComponent } from './bookmarks.component';

const routes: Routes = [
  {
    path: '',
    component: BookmarksComponent,
    data: { title: 'mtd.menu.bookmarks' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookmarksRoutingModule {}
