import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'articles-list', pathMatch: 'full' },
  {
    path: 'articles-list',
    loadComponent: () =>
      import('./components/articles-list/articles-list').then((m) => m.ArticlesList),
  },
  {
    path: 'articles/:id',
    loadComponent: () =>
      import('./components/edit-article/edit-article').then((m) => m.EditArticle),
  },
    {
    path: 'newArticle',
    loadComponent: () =>
      import('./components/edit-article/edit-article').then((m) => m.EditArticle),
  },
];
