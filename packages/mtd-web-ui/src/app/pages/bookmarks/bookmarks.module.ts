import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './bookmarks.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [BookmarksComponent],
  imports: [CommonModule, SharedModule],
})
export class BookmarksModule {}
