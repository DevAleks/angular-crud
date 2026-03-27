import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';
import { AppStore } from '../../store/app.store';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppConstants } from '../../shared/app.constants';

@Component({
  selector: 'app-edit-article',
  imports: [CommonModule],
  templateUrl: './edit-article.html',
  styleUrl: './edit-article.scss',
})
export class EditArticle {
    readonly store = inject(AppStore);

    readonly router = inject(Router);

    readonly isCreateMode = computed(() => this.store.pageMode() === AppConstants.ARTICLE_CREATE);
    readonly isUpdateMode = computed(() => this.store.pageMode() === AppConstants.ARTICLE_UPDATE);

    readonly id = input<number, string | number>(0, { transform: numberAttribute });

    readonly article = linkedSignal(() => {
        const id = this.id();
        if (this.isCreateMode()) {
            return '';
        } else if (this.isUpdateMode() && id >= 0) {
            return this.store.articlesEntityMap()[id]!.text;
        }
        return undefined;
    });
    
    /**
     * Navigate back to the articles list page. 
     * 
     * @return void
     */
    backToArticlesList(): void {
        this.router.navigate(['/articles-list']);
    }

    // TODO
    readonly route = inject(ActivatedRoute);
    readonly params = toSignal(this.route.params);

    constructor() {
        effect(() => {
            console.log('URL params:', this.params());
            console.log('Full URL:', this.router.url);
            console.log('Id:', this.id());
        });
    }


}
