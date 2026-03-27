import { AppConstants } from '../shared/app.constants';

// The special type for the opening mode of the edit-article component
export type Mode = typeof AppConstants.ARTICLE_UPDATE | typeof AppConstants.ARTICLE_CREATE | null;

export interface Article {
    readonly id: number;
    readonly text: string;
    readonly selectionStart: number;
    readonly selectionEnd: number;
    readonly annotationText: string;
    readonly annotationColor: string;
}
