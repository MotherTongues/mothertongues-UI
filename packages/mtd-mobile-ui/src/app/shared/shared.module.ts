import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryListComponent } from './entry-list.component';
import { SearchEntryListComponent } from './search-entry-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [EntryListComponent, SearchEntryListComponent],
  exports: [EntryListComponent, SearchEntryListComponent],
})
export class SharedModule {}
