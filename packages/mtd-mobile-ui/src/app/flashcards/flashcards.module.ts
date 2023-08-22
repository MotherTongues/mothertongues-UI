import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlashcardsPageRoutingModule } from './flashcards-routing.module';

import { FlashcardsPage } from './flashcards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashcardsPageRoutingModule
  ],
  declarations: [FlashcardsPage]
})
export class FlashcardsPageModule {}
