import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DataService } from './data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchPageModule } from './search/search.module';
import { SharedModule } from './shared/shared.module';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        SearchPageModule,
        SharedModule], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        DataService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
