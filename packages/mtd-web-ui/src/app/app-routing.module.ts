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
    data: { title: 'mtd.menu.home' }
  },
  {
    path: 'browse',
    redirectTo: 'browse/0',
    pathMatch: 'full'
  },
  {
    path: 'browse/:start',
    component: BrowseComponent,
    data: { title: 'mtd.menu.browse' }
  },
  {
    path: 'bookmarks',
    component: BookmarksComponent,
    data: { title: 'mtd.menu.bookmarks' }
  },
  {
    path: 'random',
    component: RandomComponent,
    data: { title: 'mtd.menu.random' }
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { title: 'mtd.menu.search' }
  },
  {
    path: 'settings',
    component: SettingsContainerComponent,
    data: { title: 'mtd.menu.settings' }
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
      // enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
