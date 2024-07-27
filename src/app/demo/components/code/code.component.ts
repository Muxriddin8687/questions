import { Component, ElementRef, AfterViewInit, Input, NgModule, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
    selector: 'app-code',
    template: `
        <pre [ngClass]="'language-' + lang"><code #code><ng-content></ng-content>
</code></pre>
    `,
    styleUrls: ['./code.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgClass]
})
export class AppCodeComponent implements AfterViewInit {

    @Input() lang = 'markup';

    @ViewChild('code') codeViewChild!: ElementRef;

    constructor(public el: ElementRef) { }

    ngAfterViewInit() {
        // @ts-ignore
        if (window['Prism']) {
            // @ts-ignore
            window['Prism'].highlightElement(this.codeViewChild.nativeElement);
        }
    }
}


