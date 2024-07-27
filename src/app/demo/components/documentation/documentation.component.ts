import { Component } from '@angular/core';
import { AppCodeComponent } from '../code/code.component';

@Component({
    templateUrl: './documentation.component.html',
    standalone: true,
    imports: [AppCodeComponent]
})
export class DocumentationComponent { }