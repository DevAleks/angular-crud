import { Article } from "../models/articles.model";

export const INIT_ARTICLES: Article[] =  [
    {
        id: 0,
        text: 'Article 1 The text of the article 1...',
        selectionStart: 5,
        selectionEnd: 15,
        annotationText: 'Important annotation',
        annotationColor: 'blue'
    },
    {
        id: 1,
        text: 'Article 2 Lorum ipsum...',
        selectionStart: 0,
        selectionEnd: 0,
        annotationText: '',
        annotationColor: 'none'    
    },
    {
        id: 2,
        text: 'Article 3 Lorum ipsum, lorum ipsum etc.',
        selectionStart: 2,
        selectionEnd: 10,
        annotationText: 'Very important annotation',
        annotationColor: 'red'
    },
]