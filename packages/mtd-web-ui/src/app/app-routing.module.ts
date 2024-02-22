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
    path: 'introduction',
    loadChildren: () =>
      import('./pages/introduction/introduction.module').then(
        m => m.IntroductionModule
      )
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then(m => m.AboutModule)
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
    path: 'people',
    loadChildren: () =>
      import('./pages/people/people.module').then(m => m.PeopleModule)
  },
  {
    path: 'speakers',
    loadChildren: () =>
      import('./pages/speakers/speakers.module').then(m => m.SpeakersModule)
  },
  {
    path: 'speakers/:speaker',
    loadChildren: () =>
      import('./pages/speakers/speakers.module').then(m => m.SpeakersModule)
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
