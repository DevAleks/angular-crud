import { Component, inject, input } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { Article } from '../../models/articles.model';
import { Router } from '@angular/router';
import { AppConstants } from '../../shared/app.constants';

@Component({
    selector: 'app-article-item',
    templateUrl: './article-item.html',
    styleUrl: './article-item.scss',
})
export class ArticleItem {
    readonly store = inject(AppStore);
    readonly router = inject(Router);

    readonly article = input.required<Article>();

    /**
     * Navigate to the article page and set the page mode to ARTICLE_UPDATE.
     * The page mode is used in the EditArticle component to determine whether we are
     * creating a new article or updating an existing one.
     *
     * @param id - The id of the article to open.
     * @returns void
     */
    openArticle(id: number) {
        this.store.updatePageMode(AppConstants.ARTICLE_UPDATE);
        this.router.navigate(['/articles', id]);
    }
}
