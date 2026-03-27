import { afterNextRender, Component, computed, ElementRef, inject, input, linkedSignal, Renderer2, viewChild } from '@angular/core';
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
    readonly #router = inject(Router);
    readonly #renderer = inject(Renderer2);

    readonly article = input.required<Article>();

    // Getting a reference to the article text container
    readonly articleWrap = viewChild<ElementRef<HTMLTextAreaElement>>('articleWrap');

    // Signal for the starting position of the selected text
    readonly rangeStart = linkedSignal(() => {
        const id = this.article().id;
        if (id >= 0) {
            return this.store.articlesEntityMap()[id].selectionStart;
        }
        return 0;
    });

    // Signal for the ending position of the selected text
    readonly rangeEnd = linkedSignal(() => {
        const id = this.article().id;
        if (id >= 0) {
            return this.store.articlesEntityMap()[id].selectionEnd;
        }
        return 0;
    });

    // Signal for annotation color    
    readonly annotationColor = linkedSignal(() => {
        const id = this.article().id;
        if (id >= 0) {
            return this.store.articlesEntityMap()[id].annotationColor;
        }
        return 'none';
    });

    // Signal for getting annotation text  
    readonly annotationText = linkedSignal(() => {
        const id = this.article().id;
        if (id >= 0) {
            return this.store.articlesEntityMap()[id].annotationText;
        }
        return '';
    });
        
    // Signal to check if the annotation exists
    readonly isAnnotation = computed(() => {
        const text = this.annotationText();
        const isRangeValid = (this.rangeStart() >= 0 && this.rangeEnd() >= 0) 
            && (this.rangeEnd() > this.rangeStart());
        return text && text.length > 0 && isRangeValid;
    });

    constructor() {        
        afterNextRender(() => {
            if(this.isAnnotation()) {
                this.highlightText(this.rangeStart(), this.rangeEnd());
            }
        });
    }    

    /**
     * Highlights the text in the article based on the provided start and end positions.
     * It creates a span element with a specific background color and wraps the selected text.
     * @param start - The starting position of the text to be highlighted.
     * @param end - The ending position of the text to be highlighted.
     */
    highlightText(start: number, end: number) {        
        const container = this.articleWrap()?.nativeElement;
        const textNode = container?.firstChild;

        if (textNode?.nodeType !== Node.TEXT_NODE) return;

        const range = document.createRange();
        range.setStart(textNode, start);
        range.setEnd(textNode, end);

        const span = this.#renderer.createElement('span');
        this.#renderer.addClass(span, 'highlight');
        this.#renderer.setStyle(span, 'background-color', this.annotationColor());        

        // TODO
        // this.#renderer.setAttribute(span, 'apptooltip', this.annotationText());

        range.surroundContents(span);        
    }

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
        this.#router.navigate(['/articles', id]);
    }
}
