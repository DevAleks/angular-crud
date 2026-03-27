import { Directive, Input, ElementRef, Renderer2, HostListener, OnDestroy, inject } from '@angular/core';

@Directive({
    selector: '[apptooltip]',
    standalone: true,
})
export class TooltipDirective implements OnDestroy {
    @Input('apptooltip') tooltipText: string = '';
    #tooltipElement: any;

    readonly #el = inject(ElementRef);
    readonly #renderer: Renderer2 = inject(Renderer2);


    @HostListener('mouseenter') onMouseEnter() {
        if (!this.#tooltipElement) {
        this.#createTooltip();
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.#tooltipElement) {
        this.#hideTooltip();
        }
    }

    ngOnDestroy() {
        this.#hideTooltip();
    }

    // TODO 
    #createTooltip() {
        this.#tooltipElement = this.#renderer.createElement('div');
        
        this.#renderer.appendChild(this.#tooltipElement, this.#renderer.createText(this.tooltipText));
        
        this.#renderer.addClass(this.#tooltipElement, 'custom-tooltip');
        
        this.#renderer.setStyle(this.#tooltipElement, 'position', 'absolute');
        this.#renderer.setStyle(this.#tooltipElement, 'background-color', '#333');
        this.#renderer.setStyle(this.#tooltipElement, 'color', '#fff');
        this.#renderer.setStyle(this.#tooltipElement, 'padding', '5px');
        this.#renderer.setStyle(this.#tooltipElement, 'border-radius', '4px');
        this.#renderer.setStyle(this.#tooltipElement, 'z-index', '1000');
        
        this.#renderer.appendChild(document.body, this.#tooltipElement);
        
        const hostPos = this.#el.nativeElement.getBoundingClientRect();
        this.#renderer.setStyle(this.#tooltipElement, 'top', `${hostPos.bottom + 5}px`);
        this.#renderer.setStyle(this.#tooltipElement, 'left', `${hostPos.left}px`);
    }

    #hideTooltip() {
        if (this.#tooltipElement) {
        this.#renderer.removeChild(document.body, this.#tooltipElement);
        this.#tooltipElement = null;
        }
    }
}
