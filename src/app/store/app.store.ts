import { getState, patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { initialAppSlice } from './app.slice';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect } from '@angular/core';
import { Article, Mode } from '../models/articles.model';
import { addEntity, entityConfig, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { INIT_ARTICLES } from '../data/init-articles';

const articleConfig = entityConfig({
    entity: type<Article>(),
    collection: 'articles', 
    selectId: article => article.id
});

export const AppStore = signalStore(
    { providedIn: 'root' },    
    withEntities(articleConfig), 
    withState(initialAppSlice),
    withComputed(store => ({
        articlesList: computed(() => [...store.articlesEntities()].reverse()),
    })),
    withMethods(store => ({
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
            patchState(store,  updateEntity({ 
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
            patchState(store,  updateEntity({ 
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
    })),
    withHooks(store => ({
        onInit: () => {
            patchState(store, setAllEntities(INIT_ARTICLES, articleConfig))
            const stateJson = localStorage.getItem('app-store');
            if (stateJson) {
                const state = JSON.parse(stateJson);
                patchState(store, state);
            }
        
            effect(() => {
                const state = getState(store);
                const stateJson = JSON.stringify(state);
                localStorage.setItem('app-store', stateJson);
            })
        }
    })),  
    withDevtools('app-store'),    
);
