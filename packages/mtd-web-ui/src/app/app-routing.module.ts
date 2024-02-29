import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeModule } from './pages/home/home.module';
import { HomeComponent } from './pages/home/home.component';
import { BrowseModule } from './pages/browse/browse.module';
import { BrowseComponent } from './pages/browse/browse.component';
import { BookmarksModule } from './pages/bookmarks/bookmarks.module';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { RandomModule } from './pages/random/random.module';
import { RandomComponent } from './pages/random/random.component';
import { SearchModule } from './pages/search/search.module';
import { SearchComponent } from './pages/search/search.component';
import { SettingsModule } from './pages/settings/settings.module';
import { SettingsContainerComponent } from './pages/settings/settings-container.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'browse',
    redirectTo: 'browse/0',
    pathMatch: 'full'
  },
  {
    path: 'browse/:start',
    component: BrowseComponent,
  },
  {
    path: 'bookmarks',
    component: BookmarksComponent,
  },
  {
    path: 'random',
    component: RandomComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'settings',
    component: SettingsContainerComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [
    HomeModule,
    BrowseModule,
    BookmarksModule,
    RandomModule,
    SearchModule,
    SettingsModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
