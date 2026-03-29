import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { AppStore } from '../../store/app.store';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppConstants } from '../../shared/app.constants';

@Component({
  selector: 'app-edit-article',
  imports: [CommonModule],
  templateUrl: './edit-article.html',
  styleUrl: './edit-article.scss',
})
export class EditArticle {
    readonly store = inject(AppStore);
    readonly #router = inject(Router);

    // Getting the component mode from the store state
    readonly isCreateMode = computed(() => this.store.pageMode() === AppConstants.ARTICLE_CREATE);
    readonly isUpdateMode = computed(() => this.store.pageMode() === AppConstants.ARTICLE_UPDATE);

    // Getting the article id from the route parameters
    readonly id = input<number, string | number>(0, { transform: numberAttribute });

    // Signal for getting the article text depending on the component mode and article id
    readonly article = linkedSignal(() => {
        const id = this.id();
        if (this.isCreateMode()) {
            return '';
        } else if (this.isUpdateMode() && id >= 0) {
            return this.store.articlesEntityMap()[id]!.text;
        }
        return undefined;
    });

    // Signal for getting the annotation depending on the component mode and article id
    readonly annotation = linkedSignal(() => {
        const id = this.id();
        if (this.isUpdateMode() && id >= 0) {
            return this.store.articlesEntityMap()[id];
        }
        return undefined;
    });

    // Signal to check if the annotation exists
    readonly isAnnotation = computed(() => {
        const annotation = this.annotation();
        if (annotation && annotation.selectionStart > 0 && annotation.selectionEnd > 0) {
            return true;
        }
        return false;
    });

    // Signal for getting annotation text
    readonly annotationText = computed(() => {        
        if (this.isUpdateMode() && this.id() >= 0) {
            return this.annotation()?.annotationText;
        }
        return '';    
    });

    // Getting a reference to the textarea element
    readonly textArea = viewChild<ElementRef<HTMLTextAreaElement>>('articleText');

    // Signal for storing the selected text in the textarea
    readonly selectedText = signal<string>('');

    // Signal for storing the initial position of the selected text
    readonly rangeStart = linkedSignal(() => {
        const id = this.id();
        if (this.isUpdateMode() && id >= 0) {
            return this.store.articlesEntityMap()[id].selectionStart;
        }
        return 0;
    });

    // Signal for storing the final position of the selected text
    readonly rangeEnd = linkedSignal(() => {
        const id = this.id();
        if (this.isUpdateMode() && id >= 0) {
            return this.store.articlesEntityMap()[id].selectionEnd;
        }
        return 0;
    });

    // Signal to temporarily store the focus state of the textarea
    readonly isTempFocused = signal(false);  

    //Set of available colors for annotation
    readonly colors = signal([
        { id: '1', label: 'None', value: 'none' },
        { id: '2', label: 'Red', value: 'red' },
        { id: '3', label: 'Blue', value: 'blue' },
        { id: '4', label: 'Yellow', value: 'yellow' },
    ]);

    readonly isSelectedText = computed(() => this.selectedText().length > 0);

    // Calcaulate the color, either take the default value or get it from the article
    readonly annotationColor = linkedSignal(() => {    
        const annotation = this.annotation();    
        if (annotation && this.isUpdateMode() && this.id() >= 0) {
            return this.annotation()?.annotationColor;
        }
        if (this.isCreateMode()) {
            return 'none';
        }
        return 'none';    
    });

    readonly newArticleId = signal<number | null>(null);

    readonly isNewArticleCreated = computed(() => {
        if(this.newArticleId() !== null && this.newArticleId() as number >= 0) {
            return true;
        }
        return false;
    });

    constructor() {        
        afterNextRender(() => {
            if(this.isUpdateMode() && this.rangeStart() >= 0 && this.rangeEnd() >= 0) {
                this.selectText(this.rangeStart(), this.rangeEnd());
            }
        });


        // TODO to be removed after testing
        effect(() => {
            // console.log('Id:', this.id());
            // console.log('Выделенный текст:', this.selectedText());
            // console.log('isUpdateMode: ', this.isUpdateMode());
            // console.log('Аннотация текст: ', this.annotationText());
            // console.log('New article Id: ', this.newArticleId());
            // console.log('isNewA: ', this.newArticleId());
        });
    }

    /**
     * Create the new article and store the Id of it in the component for possible
     * usage for the annoptation creating
     * 
     * @param articleText - text of the created new article
     */
    createArticle(articleText: string): void {
        const id = Date.now();
        this.store.createArticle(id, articleText);
        this.newArticleId.set(id);
    }

    /** 
     * Method for setting the selected text in the textarea based on the provided start 
     * and end positions of it.
     * 
     * @param start - strat of the selection
     * @param end - end of the selection
     */
    selectText(start: number, end: number) {
        const el = this.textArea()?.nativeElement;
        el?.focus(); 
        el?.setSelectionRange(start, end);
    }

    /**
     * Navigate back to the articles list page. 
     * 
     * @return void
     */
    backToArticlesList(): void {
        this.#router.navigate(['/articles-list']);
    }

    /**
     * Prevent focus loss
     * @param event - The mouse event
     */
    preventFocusLoss(event: MouseEvent) {        
        event.preventDefault();
    }

    /**
     * Restore selection after focusing on the textarea
     * @return void
     */
    restoreSelection() {
        const el = this.textArea()?.nativeElement;
        setTimeout(() => {
            this.isTempFocused.set(false);
            el?.setSelectionRange(
                this.rangeStart(),
                this.rangeEnd()
            );
        });
    }

    /**
     * Method for handling text selection in the textarea. It updates the rangeStart, 
     * rangeEnd and selectedText signals based on the current selection.
     * 
     */
    onSelectText(): void {
        const textArea = this.textArea()?.nativeElement;
        if (textArea) {
            const start = textArea.selectionStart;
            const end = textArea.selectionEnd;
            const selected = textArea.value.substring(start, end);           
            
            this.rangeStart.set(start);
            this.rangeEnd.set(end);
            this.selectedText.set(selected);
        }
    }

    /**
     * Color update method 
     * 
     * @param value - selected color value
     * @return void 
     */ 
    setColor(value: string): void {
        this.annotationColor.set(value);
    }    

    /**
     * Update annotation method. It updates annotation text, color and selected range of the existing article.
     * 
     * @param annotationText - text of the annotation
     * @return void 
     */
    updateAnnotation(annotationText: string): void {        
        this.store.updateAnnotation(
            this.id(), 
            annotationText, 
            this.annotationColor() ?? 'none',
            this.rangeStart(), 
            this.rangeEnd()
        );
    }

    /**
     * Create a new annotation method. It updates annotation text, color and selected range of the existing article.
     * 
     * @param annotationText - text of the annotation
     * @return void 
     */
    createAnnotation(annotationText: string): void {
        if (this.newArticleId() !== null && this.newArticleId() as number >= 0) {
            this.store.updateAnnotation(
                this.newArticleId() as number, 
                annotationText, 
                this.annotationColor() ?? 'none',
                this.rangeStart(), 
                this.rangeEnd()
            );
        } else {
            console.warn('Article ID is not set for the annotation creation');
            return;
        }
    }

    /**
     * Update article via RxJS method
     */
    updateArticleRxJS(id: number, article: string): void {
        this.store.updateArticleRxJS(id, article);
    }    
}
