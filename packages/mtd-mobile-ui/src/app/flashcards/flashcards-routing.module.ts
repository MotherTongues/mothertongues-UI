import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlashcardsPage } from './flashcards.page';

const routes: Routes = [
  {
    path: '',
    component: FlashcardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlashcardsPageRoutingModule {}
