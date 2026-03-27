# ArticlesCrud
Использовал NgRX Store

В первую очередь я старался создать функционал, соответствующий требованиям из предоставленной спецификации. И в то же время старался писать чистый, легкий и понятный код, избегая сложных, громоздких решений. 
Конечно же тут еще есть над чем еще поработать, например, для покрытия чуть более нестандартных юз-кейсов. 

Местами я выбирал решения, которые как мне кажется, могут в дальнейшем облегчить масштабирование функционала и при этом не сильно усложнять код "на данном этапе развития приложения". Например, я решил для редактирования статьи использовать один компонент (edit-article), который может работать в двух режимах: 
 - создание новой статьи
 - редактирование уже существующей
Т.к. как вариант в будущем для обоих этих кейсов может понадобиться плюс-минус одинаковый функционал. И вероятно заметную его часть целесообразно держать в обном компоненте.

"Штатно" не нашлось кейса для RxJS, но могу реализовать пример с этой бибилотекой. Как вариант можно сделать сервис - эмулятор асинхронного взаимодействия с бекендом, который также будет периодически выкидывать ошибки. И для взаимодействия с ним применить что-нибудь из серии switchMap, exhaustMap и добавить обработку ошибок, например через catchError. Также могу это сделать через rxMethod из NgRX Signal Store.

В результате по тз сделал почти все. Не успел реализовать показ тултипы с аннотациями в списке статей и привести в порядок внешний вид.



This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
