import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'browse',
    loadChildren: () =>
      import('./pages/browse/browse.module').then(m => m.BrowseModule)
  },
  {
    path: 'bookmarks',
    loadChildren: () =>
      import('./pages/bookmarks/bookmarks.module').then(m => m.BookmarksModule)
  },
  {
    path: 'random',
    loadChildren: () =>
      import('./pages/random/random.module').then(m => m.RandomModule)
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
