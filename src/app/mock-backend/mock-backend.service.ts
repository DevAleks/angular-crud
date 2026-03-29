import { inject, Injectable } from "@angular/core";
import { delay, Observable, of, switchMap, tap, throwError } from "rxjs";
import { AppStore } from "../store/app.store";

@Injectable({providedIn: 'root'})
export class MockBackendService {
    // readonly store = inject(AppStore);

    readonly #delays = [1000, 5000, 'error'];
    #currentDelayIndex = -1;

    #updateArticle(id: number, article: string) {
        
        // TODO
        // this.store.updateArticle(id, article);
        return article;
    }

    private nextDelay() {
        this.#currentDelayIndex = (this.#currentDelayIndex + 1) % this.#delays.length;
        return this.#delays[this.#currentDelayIndex];
    }

    updateArticleWithDelay(id: number, article: string): Observable<string> {
        const d = this.nextDelay();

        if (typeof d === 'string') {
            return of(1).pipe(
                delay(1000), 
                switchMap(_ => throwError(() => `Error updating article id:${id}`))
            )
        } else {
            return of(this.#updateArticle(id, article)).pipe(
                tap(_ => console.log(`Started updating for article id${id}`)),
                delay(d),
                tap(_ => console.log(`Finished updating for article id${id}`)),
            );    
        }       
    }
}
