import { getState, patchState, signalStore, type, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { initialAppSlice } from './app.slice';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { Article, Mode } from '../models/articles.model';
import { addEntity, entityConfig, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { INIT_ARTICLES } from '../data/init-articles';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { setBusy } from './app.updaters';
import { MockBackendService } from '../mock-backend/mock-backend.service';

const articleConfig = entityConfig({
    entity: type<Article>(),
    collection: 'articles', 
    selectId: article => article.id
});

export const AppStore = signalStore(
    { providedIn: 'root' },    
    withEntities(articleConfig), 
    withState(initialAppSlice),
    withProps((_) => {
        const _mockBackendService = inject(MockBackendService);

        return {
            _mockBackendService,
        };
    }),    
    withComputed(store => ({
        articlesList: computed(() => [...store.articlesEntities()].reverse()),
    })),
    withMethods(store => {
        // Updates a text of the existing article via RxJS method with error handling 
        // and loading state management demonstration
        const updateArticleRxJS = rxMethod<{ id: number, value: string }>(input$ => input$.pipe(
            tap(_ => patchState(store, setBusy(true))),
            switchMap(({ id, value }) => store._mockBackendService
                .updateArticleWithDelay(id, value).pipe(
                    tapResponse({
                        next: value => patchState(store, updateEntity({ 
                            id, 
                            changes: { text: value } 
                        }, articleConfig)), 
                        error: err => {
                            // store._notifications.error(`${err}`)
                            console.error(err);
                        },
                        finalize: () => patchState(store, setBusy(false))
                    })      
                )
            )
        ));

        return {
            // Creates a new article
            createArticle: (id: number, text: string) => {
                patchState(store, addEntity({
                    id,
                    text,
                    selectionStart: 0,
                    selectionEnd: 0,
                    annotationText: '',
                    annotationColor: 'none',                
                }, articleConfig))
            },

            // Removes article
            removeArticle: (id: number) => {
                patchState(store, removeEntity(id, articleConfig))
            },

            // Updates a text value of the existing article
            updateArticle: (id: number, value: string) => {
                patchState(store, updateEntity({ 
                    id, 
                    changes: { text: value } 
                }, articleConfig))
            },

            // Updates an annotation of the existing article
            updateAnnotation: (
                id: number, 
                text: string, 
                color: string, 
                rangeStart: number, 
                rangeEnd: number
            ) => {
                patchState(store, updateEntity({ 
                    id, 
                    changes: { 
                        annotationText: text, 
                        annotationColor: color, 
                        selectionStart: rangeStart, 
                        selectionEnd: rangeEnd, 
                    } 
                }, articleConfig))
            },

            // Changes the page mode of the Edit-article component
            updatePageMode: (mode: Mode) => {
                patchState(store, { pageMode: mode })
            },

            // RxJS method for articles update
            updateArticleRxJS
        }
    }),
    withHooks(store => ({
        onInit: () => {
            patchState(store, setAllEntities(INIT_ARTICLES, articleConfig));
            const stateJson = localStorage.getItem('app-store');
            if (stateJson) {
                const state = JSON.parse(stateJson);
                patchState(store, state);
            }
            patchState(store, setBusy(false));
        
            effect(() => {
                const state = getState(store);
                const stateJson = JSON.stringify(state);
                localStorage.setItem('app-store', stateJson);
            })
        }
    })),  
    withDevtools('app-store'),    
);
