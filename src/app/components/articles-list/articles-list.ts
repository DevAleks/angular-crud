import { Component, inject } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { ArticleItem } from '../article-item/article-item';
import { Router } from '@angular/router';
import { AppConstants } from '../../shared/app.constants';

@Component({
    selector: 'app-articles-list',
    imports: [ArticleItem],
    templateUrl: './articles-list.html',
    styleUrl: './articles-list.scss',
})
export class ArticlesList {

    readonly store = inject(AppStore);

    readonly router = inject(Router);

    constructor() {
        this.store.updatePageMode(null);
    }

    /**
     * Navigate to the article creation page and set the page mode to ARTICLE_CREATE. 
     * The page mode is used in the EditArticle component to determine whether we are 
     * creating a new article or updating an existing one.
     * 
     * @returns void
     */
    createNewArticle(): void {
        this.store.updatePageMode(AppConstants.ARTICLE_CREATE);
        this.router.navigate(['/newArticle']);
    }
}
